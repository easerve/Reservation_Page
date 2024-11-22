import React, { useState } from "react";
import Modal from "react-modal";
import { User, Dog } from "@/types/booking";
import { Button } from "@/components/ui/button";
import ConsentForm from "@/app/iriondaengdaeng/ConsentForm";
import Select from "react-select";
import { FormControl } from "@/components/ui/form";

interface CutAgreementPageProps {
  isOpen: boolean;
  onClose: () => void;
  breeds: { id: number; name: string; type: number }[];
  setIsPuppyAdd: (isAdd: boolean) => void;
  userUUID: string;
}

const CutAgreementPage: React.FC<CutAgreementPageProps> = ({
  isOpen,
  onClose,
  breeds,
  setIsPuppyAdd,
  userUUID,
}) => {
  const [dogInfo, setDogInfo] = useState<Dog>({
    id: "",
    petName: "",
    weight: 0,
    birth: "",
    breed: "",
    breedType: 0,
    neutering: false,
    sex: "",
    regNumber: "",
    phoneNumber: "",
  });

  const [userInfo, setUserInfo] = useState<User>({
    id: userUUID,
    name: "",
    phone: "",
    address: "",
    detailAddress: "",
  });

  const [selectedBreed, setSelectedBreed] = useState<{
    id: number;
    name: string;
    type: number;
  } | null>(null);

  const handleDogInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDogInfo({
      ...dogInfo,
      [name]:
        name === "weight"
          ? Number(value)
          : name === "neutering"
          ? Boolean(value)
          : value,
    });
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleDogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDogInfo({
      ...dogInfo,
      phoneNumber: userInfo.phone,
    });
    setCurrentStep(3);
  };

  const [currentStep, setCurrentStep] = useState(1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">보호자 정보입력</h2>
            <form onSubmit={handleUserSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  보호자명(실명)
                </label>
                <input
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleUserInfoChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">전화번호</label>
                <input
                  type="tel"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleUserInfoChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">주소</label>
                <input
                  type="text"
                  name="address"
                  value={userInfo.address}
                  onChange={handleUserInfoChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">상세주소</label>
                <input
                  type="text"
                  name="detailAddress"
                  value={userInfo.detailAddress}
                  onChange={handleUserInfoChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mt-12 flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  이전
                </Button>
                <Button type="submit" className="flex-1 bg-primary">
                  다음
                </Button>
              </div>
            </form>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">강아지 정보입력</h2>
            <form onSubmit={handleDogSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">이름</label>
                <input
                  type="text"
                  name="petName"
                  value={dogInfo.petName}
                  onChange={handleDogInfoChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">견종</label>
                <FormControl>
                  <Select
                    options={breeds.map((breed) => ({
                      value: breed.id,
                      label: breed.name,
                    }))}
                    isSearchable
                    isClearable
                    onChange={(option) => {
                      setSelectedBreed(
                        option
                          ? breeds.find((breed) => breed.id === option.value) ??
                              null
                          : null
                      );
                      setDogInfo({
                        ...dogInfo,
                        breedType: option ? option.value : 0,
                      });
                    }}
                    value={
                      selectedBreed
                        ? {
                            value: selectedBreed.id,
                            label: selectedBreed.name,
                          }
                        : null
                    }
                    isDisabled={false}
                  />
                </FormControl>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">무게</label>
                <input
                  type="number"
                  name="weight"
                  min="0"
                  max="30"
                  value={dogInfo.weight || ""}
                  onChange={handleDogInfoChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">생년월일</label>
                <input
                  type="date"
                  name="birth"
                  value={dogInfo.birth}
                  onChange={handleDogInfoChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">성별</label>
                <div className="flex items-center ">
                  <label className="w-1/2 flex items-center text-lg">
                    <input
                      type="radio"
                      name="sex"
                      value="암컷"
                      checked={dogInfo.sex === "암컷"}
                      onChange={handleDogInfoChange}
                      required
                      className="mr-2 w-6 h-6"
                    />
                    암컷
                  </label>
                  <label className="w-1/2 flex items-center text-lg">
                    <input
                      type="radio"
                      name="sex"
                      value="수컷"
                      checked={dogInfo.sex === "수컷"}
                      onChange={handleDogInfoChange}
                      required
                      className="mr-2 w-6 h-6"
                    />
                    수컷
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">중성화</label>
                <div className="flex items-center ">
                  <label className="w-1/2 flex items-center text-lg">
                    <input
                      type="radio"
                      name="neutering"
                      value="true"
                      checked={dogInfo.neutering === true}
                      onChange={() =>
                        setDogInfo({ ...dogInfo, neutering: true })
                      }
                      required
                      className="mr-2 w-6 h-6"
                    />
                    중성화O
                  </label>
                  <label className="w-1/2 flex items-center text-lg">
                    <input
                      type="radio"
                      name="neutering"
                      value="false"
                      checked={dogInfo.neutering === false}
                      onChange={() =>
                        setDogInfo({ ...dogInfo, neutering: false })
                      }
                      required
                      className="mr-2 w-6 h-6"
                    />
                    중성화X
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  동물등룩 번호
                </label>
                <input
                  type="text"
                  name="regNumber"
                  value={dogInfo.regNumber}
                  onChange={handleDogInfoChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-2 mt-12">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  이전
                </Button>
                <Button type="submit" className="flex-1 bg-primary">
                  다음
                </Button>
              </div>
            </form>
          </div>
        );
      case 3:
        return (
          <div>
            <ConsentForm
              setCurrentStep={setCurrentStep}
              dogInfo={dogInfo}
              userInfo={userInfo}
              onClose={onClose}
              setIsPuppyAdd={setIsPuppyAdd}
            />
          </div>
        );
    }
  };

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Cut Agreement"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-screen overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary">강아지 추가하기</h1>
          <div className="flex justify-between mt-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 mx-1 rounded ${
                  step <= currentStep ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="container max-w-md mx-auto p-4">{renderStep()}</div>
      </div>
    </Modal>
  );
};

export default CutAgreementPage;
