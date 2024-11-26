import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { BIG_DOG_SERVICE_PRICES } from "@/constants/booking";
import { Option, BookingData, MainService } from "@/types/booking";
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
  // 5번은 프론트에서 처리
  const getWeightRangeId = (weight: number) => {
    if (weight <= 4) return 1;
    else if (weight <= 6) return 2;
    else if (weight <= 8) return 3;
    else return 4;
  };
  async function fetchServicePrices() {
    if (!bookingData.dog.weight || !bookingData.dog.breed) return;

    setIsLoadingPrices(true);
    try {
      const weightRangeId = getWeightRangeId(bookingData.dog.weight);
      // NOTE: 불필요한 while
      const typeId =
        breeds.find((breed) => breed.name === bookingData.dog.breed)?.type ?? 1;

      const response = await fetch(
        `/api/services?weightRangeId=${weightRangeId}&typeId=${typeId}`,
      );

      if (!response.ok) throw new Error("Failed to fetch prices");

      const newOptionCategories: {
        category: string;
        options: Option[];
      }[] = [];

      const data = await response.json();
      // NOTE: kg당 가격 추가
      const addPrice =
        bookingData.dog.weight > 10 && typeId !== 4
          ? Math.floor((bookingData.dog.weight - 10 + 1) / 2) * 5000
          : 0;
      // NOTE: 대형견 가격으로 갱신
      const bigDogServicePrices = typeId === 4 ? BIG_DOG_SERVICE_PRICES : [];

      data.data.forEach((service: MainService) => {
        if (typeId === 4) {
          const bigDogService = bigDogServicePrices.find(
            (bigDogService) => bigDogService.id === service.id,
          );
          if (bigDogService) {
            service.price = bigDogService.price_per_kg * bookingData.dog.weight;
          }
        } else {
          service.price += addPrice;
        }
        // service.options.forEach((option: Option) => {
        //   const category = option.category;
        //   const existingCategory = newOptionCategories.find(
        //     (opt) => opt.category === category,
        //   );

        //   if (existingCategory) {
        //     if (!existingCategory.options.some((opt) => opt.id === option.id)) {
        //       existingCategory.options.push(option);
        //     }
        //   } else {
        //     newOptionCategories.push({ category, options: [option] });
        //   }
        // });
      });

      setOptionCategories(newOptionCategories);
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

  const [tempOptions, setTempOptions] = useState<Option[]>([]); // 임시 옵션 저장
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [servicesPricing, setServicesPricing] = useState<MainService[]>([]);
  const [optionCategories, setOptionCategories] = useState<
    {
      category: string;
      options: Option[];
    }[]
  >([]);

  const updatePrice = (newPrice: number[]) => {
    setBookingData((prev) => ({
      ...prev,
      price: newPrice,
    }));
  };

  const price = useMemo(() => {
    if (!bookingData.mainService) {
      return [0, 0];
    }
    let totalPrice = 0;

    if (bookingData.mainService) {
      totalPrice += bookingData.mainService.price;
      bookingData.mainService.options.forEach((option) => {
        totalPrice += option.price;
      });
    }

    const totalPriceMax = totalPrice;

    return [totalPrice, totalPriceMax];
  }, [bookingData.mainService, bookingData]);

  const handleMainServiceSelect = (service: MainService) => {
    if (bookingData.mainService?.id !== service.id) {
      setBookingData((prev) => ({
        ...prev,
        mainService: { ...service, options: [] },
      }));
      setTempOptions([]);
    }
    if (service.options && service.options.length > 0) {
      setIsModalOpen(true);
    }
  };

  const handleModalOptionToggle = (option: Option) => {
    setTempOptions((prev) => {
      const isSelected = prev.some((opt) => opt.id === option.id);
      const isSameCategory = prev.some(
        (opt) => opt.category === option.category,
      );
      if (isSelected) {
        return prev.filter((opt) => opt.id !== option.id);
      } else if (isSameCategory) {
        return prev.map((opt) =>
          opt.category === option.category ? option : opt,
        );
      } else {
        return [...prev, option];
      }
    });
  };

  const confirmOptionSelection = () => {
    setBookingData((prev) => {
      if (!prev.mainService) return prev;
      return {
        ...prev,
        mainService: {
          ...prev.mainService,
          options: tempOptions,
        },
      };
    });
    setIsModalOpen(false);
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
              <div key={service.id} className="space-y-2">
                <Button
                  variant="outline"
                  className={`w-full justify-between h-auto py-4 ${
                    bookingData.mainService?.id === service.id
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
                {optionCategories.map(({ category, options }) => (
                  <div key={category} className="space-y-2">
                    <h3 className="font-bold mb-2">{category}</h3>
                    {options.map((option) => (
                      <Button
                        key={option.id}
                        variant="outline"
                        onClick={() => handleModalOptionToggle(option)}
                        className={`w-full justify-between ${
                          tempOptions.some((opt) => opt.id === option.id)
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
                <Button onClick={confirmOptionSelection}>선택 완료</Button>
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
            {price[0] === price[1]
              ? `${price[0].toLocaleString()}원`
              : `${price[0].toLocaleString()}~${price[1].toLocaleString()}원`}
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
