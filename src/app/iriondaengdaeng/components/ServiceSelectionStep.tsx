import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { BIG_DOG_SERVICE_PRICES } from "@/constants/booking";
import {
  Option,
  OptionCategory,
  BookingData,
  MainService,
} from "@/types/booking";
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
  const [optionsCache, setOptionsCache] = useState<{
    [key: number]: OptionCategory;
  }>({});
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
      bookingData.mainService.optionCategories.forEach((optionCategory) => {
        optionCategory.options.forEach((option) => {
          totalPrice += option.option_price;
        });
        // NOTE: 다리 미용은 5000 ~ 15000원 (시가임)
        if (optionCategory.category_name === "다리 미용") {
          priceRange += 10000;
        }
      });
    }

    return [totalPrice, priceRange];
  }, [bookingData.mainService]);

  async function fetchOptions(service_name_id: number) {
    if (optionsCache[service_name_id]) return optionsCache[service_name_id];
    const response = await fetch(
      `api/services/option?serviceNameId=${service_name_id}`,
    );
    if (!response.ok) throw new Error("Failed to fetch options");
    const data = await response.json();
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
        mainService: { ...service, optionCategories: [] },
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
    setBookingData((prev) => {
      if (!prev.mainService) return prev;

      const isCategory4 = option.category_id === 4;
      const mainService = { ...prev.mainService };
      let optionCategories = [...mainService.optionCategories];

      // 1. 이미 선택되어 있는 옵션인지 확인
      const isOptionAlreadySelected = optionCategories.some((optionCategory) =>
        optionCategory.options.some(
          (opt) => opt.option_id === option.option_id,
        ),
      );

      if (isOptionAlreadySelected) {
        // 현재 옵션을 선택 해제
        optionCategories = optionCategories
          .map((optionCategory) => {
            if (optionCategory.category_id === option.category_id) {
              const filteredOptions = optionCategory.options.filter(
                (opt) => opt.option_id !== option.option_id,
              );
              return { ...optionCategory, options: filteredOptions };
            }
            return optionCategory;
          })
          .filter((optionCategory) => optionCategory.options.length > 0);

        return {
          ...prev,
          mainService: {
            ...mainService,
            optionCategories,
          },
        };
      }

      const categoryIndex = optionCategories.findIndex(
        (optionCategory) => optionCategory.category_id === option.category_id,
      );

      if (categoryIndex >= 0) {
        const optionCategory = { ...optionCategories[categoryIndex] };

        if (isCategory4) {
          // 2. 카테고리 4번(스파케어)는 중복 선택 가능
          optionCategory.options = [...optionCategory.options, option];
        } else {
          // 3. 이미 선택된 카테고리라면 카테고리의 옵션을 지우고 새로운 옵션으로 대체
          optionCategory.options = [option];
        }

        optionCategories[categoryIndex] = optionCategory;
      } else {
        // 4. 다른 카테고리라면 mainService에 추가
        const category_name =
          optionsCache[option.category_id]?.category_name || "";

        const newOptionCategory: OptionCategory = {
          category_id: option.category_id,
          category_name,
          options: [option],
        };

        optionCategories.push(newOptionCategory);
      }

      return {
        ...prev,
        mainService: {
          ...mainService,
          optionCategories,
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
            <div className="flex justify-center">
              <div className="loader animate-spin rounded-full border-4 border-t-transparent border-gray-500 w-8 h-8"></div>
            </div>
          ) : (
            servicesPricing.map((service) => (
              <div key={service.service_name_id} className="space-y-2">
                <Button
                  variant="outline"
                  className={`w-full justify-between h-auto py-4 ${
                    bookingData.mainService?.service_name_id ===
                    service.service_name_id
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
                  ).map(([category_id, OptionCategory]) => {
                    console.groupCollapsed("옵션 선택");
                    console.log(
                      optionsCache[bookingData.mainService.service_name_id],
                    );
                    console.log(category_id);
                    console.log(OptionCategory);
                    console.groupEnd();
                    return (
                      <div key={category_id} className="space-y-2">
                        <h3 className="font-bold mb-2">
                          {OptionCategory.category_name}
                        </h3>
                        {OptionCategory.options.map((option) => {
                          return (
                            <Button
                              key={option.option_id}
                              variant="outline"
                              onClick={() => handleModalOptionToggle(option)}
                              className={`w-full justify-between ${
                                bookingData.mainService.optionCategories.some(
                                  (optionCategory) =>
                                    optionCategory.options.some(
                                      (opt) => opt.option_id === option.option_id,
                                    ),
                                )
                                  ? "border-primary bg-primary/10"
                                  : ""
                              }`}
                            >
                              <div className="flex justify-between w-full">
                                <span>{option.option_name}</span>
                                <span className="text-sm text-muted-foreground">
                                  +{option.option_price.toLocaleString()}원
                                </span>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    );
                  })}
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
