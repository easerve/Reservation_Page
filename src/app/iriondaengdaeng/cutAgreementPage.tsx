import React, { useState } from "react";
import Modal from "react-modal";
import { User, Dog } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { boolean } from "zod";

// if (typeof window !== "undefined") {
//   Modal.setAppElement("#__next");
// }

interface CutAgreementPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const CutAgreementPage: React.FC<CutAgreementPageProps> = ({
  isOpen,
  onClose,
}) => {
  const [dogInfo, setDogInfo] = useState<Dog>({
    id: "",
    name: "",
    weight: 0,
    birth: "",
    breed: "",
    neutering: false,
    sex: "",
    regNumber: "",
  });
  const [userInfo, setUserInfo] = useState<User>({
    name: "",
    phone: "",
    address: "",
    detailAddress: "",
  });

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
    console.log(userInfo);
    setCurrentStep(2);
  };

  const handleDogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(dogInfo);
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
                  name="name"
                  value={dogInfo.name}
                  onChange={handleDogInfoChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">견종</label>
                <input
                  type="text"
                  name="breed"
                  value={dogInfo.breed}
                  onChange={handleDogInfoChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">무게</label>
                <input
                  type="number"
                  name="weight"
                  value={dogInfo.weight}
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
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(2)}
            >
              이전
            </Button>
            <Button type="submit" className="flex-1 bg-primary">
              다음
            </Button>
          </div>
        );
    }
  };

  return (
    <Modal
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
