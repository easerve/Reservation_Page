import React, { useState } from "react";
import Modal from "react-modal";

interface CutAgreementPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const CutAgreementPage: React.FC<CutAgreementPageProps> = ({
  isOpen,
  onClose,
}) => {
  const [dogInfo, setDogInfo] = useState({
    name: "",
    breed: "",
    age: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDogInfo({
      ...dogInfo,
      [name]: name === "age" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(dogInfo);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Cut Agreement"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">강아지 추가하기</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">이름</label>
            <input
              type="text"
              name="name"
              value={dogInfo.name}
              onChange={handleChange}
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
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">나이</label>
            <input
              type="number"
              name="age"
              value={dogInfo.age}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-secondary bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CutAgreementPage;
