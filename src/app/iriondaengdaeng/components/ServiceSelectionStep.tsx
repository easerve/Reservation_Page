import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { BIG_DOG_SERVICE_PRICES } from "@/constants/booking";
import { Option, OptionsData, BookingData, MainService } from "@/types/booking";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface ServiceSelectionStepProps {
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
  setCurrentStep: (step: number) => void;
  breeds: { id: number; name: string; type: number }[];
}
export default function ServiceSelectionStep({
  bookingData,
  setBookingData,
  setCurrentStep,
  breeds,
}: ServiceSelectionStepProps) {
  const [optionsCache, setOptionsCache] = useState<OptionsData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [servicesPricing, setServicesPricing] = useState<MainService[]>([]);

  // NOTE: 5번(~10kg)은 프론트에서 처리
  const getWeightRangeId = (weight: number) => {
    if (weight < 4) return 1;
    else if (weight < 6) return 2;
    else if (weight < 8) return 3;
    else return 4;
  };

  // NOTE: 없는 견종은 1(A)로 처리
  const getTypeId = () =>
    breeds.find((breed) => breed.name === bookingData.dog.breed)?.type ?? 1;

  async function fetchServicePrices() {
    if (!bookingData.dog.weight || !bookingData.dog.breed) return;

    setIsLoadingPrices(true);
    try {
      const weightRangeId = getWeightRangeId(bookingData.dog.weight);
      const typeId = getTypeId();

      const response = await fetch(
        `/api/services?weightRangeId=${weightRangeId}&typeId=${typeId}`,
      );

      if (!response.ok) throw new Error("Failed to fetch prices");

      const data = await response.json();
      // NOTE: kg당 가격 추가 (10kg 초과시 2kg당 5000원) 위생 미용은 따로 처리
      const addPrice =
        bookingData.dog.weight > 10 && typeId !== 4
          ? Math.ceil((bookingData.dog.weight - 10) / 2) * 5000
          : 0;
      // NOTE: 위생미용: kg당 가격 추가 (10kg 초과시 5kg당 5000원)
      const groomingAddPrice =
        bookingData.dog.weight > 10 && typeId === 4
          ? Math.ceil((bookingData.dog.weight - 10) / 5) * 5000
          : 0;
      // NOTE: 대형견 서비스 가격 (kg per price)
      const bigDogServicePrices = typeId === 4 ? BIG_DOG_SERVICE_PRICES : [];

      data.data.forEach((service: MainService) => {
        const bigDogService = bigDogServicePrices.find(
          (bigDogService) => bigDogService.id === service.service_name_id,
        );
        if (bigDogService) {
          service.price = bigDogService.price_per_kg * bookingData.dog.weight;
        } else if (service.service_name_id === 5) {
          // NOTE: 대형견의 경우 위생미용도 5kg당 5000원 추가
          service.price += groomingAddPrice;
        } else {
          service.price += addPrice;
        }
      });
      setServicesPricing(data.data);
    } catch (error) {
      console.error("Error fetching service prices:", error);
    } finally {
      setIsLoadingPrices(false);
    }
  }

  useEffect(() => {
    fetchServicePrices();
  }, []);

  const updatePrice = (newPrice: number[]) => {
    setBookingData((prev) => ({
      ...prev,
      price: newPrice,
    }));
  };

  const price: number[] = useMemo(() => {
    if (!bookingData.mainService) {
      return [0, 0];
    }
    let totalPrice = 0;
    let priceRange = 0;

    if (bookingData.mainService) {
      totalPrice += bookingData.mainService.price;
      bookingData.mainService.options.forEach((option) => {
        totalPrice += option.price;
        // NOTE: 다리 미용은 5000 ~ 15000원 (시가임)
        if (
          option.name === "장화" ||
          option.name === "방울" ||
          option.name === "나팔" ||
          option.name === "슬리퍼"
        ) {
          priceRange += 10000;
        }
      });
    }

    return [totalPrice, priceRange];
  }, [bookingData.mainService]);

  async function fetchOptions(service_name_id: number) {
    if (optionsCache[service_name_id]) return optionsCache[service_name_id];
    const response = await fetch(`api/services/option?serviceNameId=${service_name_id}`);
    if (!response.ok) throw new Error("Failed to fetch options");
    const data = await response.json();
    console.log(data);
    const newOptions = data.data;
    // FIXME: 라인컷을 할 수 있는 견종만 라인컷 보여주기
    setOptionsCache((prev) => ({
      ...prev,
      [service_name_id]: newOptions,
    }));
    return data.data;
  }

  const handleMainServiceSelect = async (service: MainService) => {
    if (bookingData.mainService?.service_name_id !== service.service_name_id) {
      setBookingData((prev) => ({
        ...prev,
        mainService: { ...service, options: [] },
      }));
    }

    try {
      const options = await fetchOptions(service.service_name_id);
      if (Object.keys(options).length > 0) {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const handleModalOptionToggle = (option: Option) => {
    // 현재 옵션의 카테고리 찾기
    const currentCategory = Object.entries(
      optionsCache[bookingData.mainService.service_name_id],
    ).find(([_, options]) =>
      options.some((opt) => opt.name === option.name),
    )?.[0];

    setBookingData((prev) => {
      if (!prev.mainService) return prev;
      return {
        ...prev,
        mainService: {
          ...prev.mainService,
          options: prev.mainService.options.some(
            (opt) => opt.name === option.name,
          )
            ? prev.mainService.options.filter((opt) => opt.name !== option.name)
            : [
                ...prev.mainService.options.filter((opt) => {
                  const optionCategory = Object.entries(
                    optionsCache[bookingData.mainService.service_name_id],
                  ).find(([_, options]) =>
                    options.some((o) => o.name === opt.name),
                  )?.[0];

                  // NOTE: 스파케어는 중복 선택 가능
                  if (currentCategory === "스파케어") return true;

                  return optionCategory !== currentCategory;
                }),
                option,
              ],
        },
      };
    });
  };

  const cancelOptionSelection = () => {
    setBookingData((prev) => ({
      ...prev,
      mainService: undefined,
    }));
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>메인 서비스</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoadingPrices ? (
            <div>가격 정보를 불러오는 중...</div>
          ) : (
            servicesPricing.map((service) => (
              <div key={service.service_name_id} className="space-y-2">
                <Button
                  variant="outline"
                  className={`w-full justify-between h-auto py-4 ${
                    bookingData.mainService?.service_name_id === service.service_name_id
                      ? "border-primary bg-primary/10"
                      : ""
                  }`}
                  onClick={() => handleMainServiceSelect(service)}
                >
                  <span>{service.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {service.price.toLocaleString()}원
                  </span>
                </Button>
              </div>
            ))
          )}
        </CardContent>
        {bookingData.mainService && isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-[90vw] md:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {bookingData.mainService.name} 옵션 선택
                </DialogTitle>
                <DialogDescription>
                  원하시는 옵션을 선택해주세요.
                </DialogDescription>
                <DialogClose onClick={cancelOptionSelection} />
              </DialogHeader>
              <div className="h-[50vh] overflow-y-auto pr-2 space-y-4">
                {optionsCache[bookingData.mainService.service_name_id] &&
                  Object.entries(
                    optionsCache[bookingData.mainService.service_name_id],
                  ).map(([category, options]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="font-bold mb-2">{category}</h3>
                      {options.map((option) => (
                        <Button
                          key={option.name}
                          variant="outline"
                          onClick={() => handleModalOptionToggle(option)}
                          className={`w-full justify-between ${
                            bookingData.mainService.options.some(
                              (opt) => opt.name === option.name,
                            )
                              ? "border-primary bg-primary/10"
                              : ""
                          }`}
                        >
                          <div className="flex justify-between w-full">
                            <span>{option.name}</span>
                            <span className="text-sm text-muted-foreground">
                              +{option.price.toLocaleString()}원
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  ))}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={cancelOptionSelection}>
                  취소
                </Button>
                <Button onClick={() => setIsModalOpen(false)}>선택 완료</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>결제 금액</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary text-right">
            {price[1] === 0
              ? `${price[0].toLocaleString()}원`
              : `${price[0].toLocaleString()}~${(price[0] + price[1]).toLocaleString()}원`}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setCurrentStep(3)}>
          이전
        </Button>
        <Button
          className="flex-1 bg-primary"
          onClick={() => {
            if (!bookingData.mainService) {
              return;
            }
            updatePrice(price);
            setCurrentStep(5);
          }}
          disabled={!bookingData.mainService}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
