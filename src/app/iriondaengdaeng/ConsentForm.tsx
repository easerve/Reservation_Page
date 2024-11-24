import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dog, User } from "@/types/booking";
import SignatureBox, { SignatureBoxRef } from "./signature-box";

interface ConsentFormProps {
  setCurrentStep: (step: number) => void;
  dogInfo: Dog;
  userInfo: User;
  onClose: () => void;
  setIsPuppyAdd: (isAdd: boolean) => void;
}

const ConsentForm: React.FC<ConsentFormProps> = ({
  setCurrentStep,
  dogInfo,
  userInfo,
  onClose,
  setIsPuppyAdd,
}) => {
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [requiredChecked, setRequiredChecked] = useState<boolean>(false);
  const [personalInfoChecked, setPersonalInfoChecked] =
    useState<boolean>(false);
  const [thirdPartyChecked, setThirdPartyChecked] = useState<boolean>(false);

  const signaturePadRef = useRef<SignatureBoxRef>(null);

  const handleClear = () => signaturePadRef.current?.clear();

  // const handleUndo = () => {
  //   const data = signaturePadRef.current?.toData();
  //   if (data && data.length > 0) {
  //     data.pop();
  //     signaturePadRef.current?.fromData(data);
  //   }
  // };

  const updateUserInfo = async () => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        throw new Error("Failed to update user info");
      }

      const data = await response.json();
      if (data.status !== "success") {
        throw new Error("Failed to update user info");
      }
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  const makeDogInfo = async () => {
    try {
      const response = await fetch("/api/pets/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          PetInfo: {
            ...dogInfo,
            breed: dogInfo.breedType,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update dog info");
      }

      const data = await response.json();
      if (data.status !== "success") {
        throw new Error("Failed to update dog info");
      }
    } catch (error) {
      console.error("Error updating dog info:", error);
    }
  };

  const handleSubmit = async () => {
    if (signaturePadRef.current?.isEmpty()) {
      alert("Please provide a signature first.");
      return;
    }

    const signatureDataUrl =
      signaturePadRef.current?.toDataURL("image/svg+xml");
    // TODO: 서명 데이터 전송 / 저장 로직 추가

    await updateUserInfo();
    await makeDogInfo();
    setCurrentStep(1);
    setIsPuppyAdd(true);
    onClose();
  };

  // const handleAllCheckedChange = () => {
  //   const newChecked = !allChecked;
  //   setAllChecked(newChecked);
  //   setRequiredChecked(newChecked);
  //   setPersonalInfoChecked(newChecked);
  //   setThirdPartyChecked(newChecked);
  // };

  const handleIndividualCheckedChange = (
    setChecked: React.Dispatch<React.SetStateAction<boolean>>,
    checked: boolean,
  ) => {
    setChecked(!checked);
    if (checked) {
      setAllChecked(false);
    }
  };

  useEffect(() => {
    if (requiredChecked && personalInfoChecked && thirdPartyChecked) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  }, [requiredChecked, personalInfoChecked, thirdPartyChecked]);

  return (
    <Dialog>
      <div className="consent-wrap">
        <div className="consent-body">
          <div className="consent-inner-body">
            <div className="consent-terms">
              <div className="consent-terms">
                <div className="consent-terms-content mr-2 flex items-center">
                  <div className="consent-terms-left flex-1 text-lg">
                    미용 동의서 (필수)
                  </div>
                  <label>
                    <input
                      type="checkbox"
                      checked={requiredChecked}
                      onChange={() =>
                        handleIndividualCheckedChange(
                          setRequiredChecked,
                          requiredChecked,
                        )
                      }
                      className="mr-2 h-6 w-6"
                    />
                  </label>
                </div>
                <div className="consent-terms-template-primary max-h-48 overflow-y-auto border p-4">
                  {(() => {
                    const birthDate = new Date(dogInfo.birth);
                    const today = new Date();
                    const months =
                      (today.getFullYear() - birthDate.getFullYear()) * 12 +
                      (today.getMonth() - birthDate.getMonth());
                    return Math.floor(months / 12);
                  })() >= 8 ? (
                    <div>
                      <p>
                        본 매장은 미용 반려동물의 나이가 만8세 이상이거나, 질병
                        또는 수술 경험이 있는 반려동물의 건강상태를 고려하여
                        아래와 같이 안내사항을 말씀 드리고, 이용 동의서를 받고자
                        합니다.
                      </p>
                      <p>
                        본 매장은 애견미용을 의뢰하신 반려동물을 미용함에 있어
                        소홀함이 없이 최대한 배려하여 미용할 것을 약속드립니다.
                      </p>
                      <p>
                        동의서는 미용사와 보호자님 그리고 반려동물 모두
                        보호하겠다는 약속입니다.
                      </p>
                      <p>보호자님의 적극적인 협조를 부탁드립니다.</p>
                      <p>
                        애견 미용 서비스를 제공하는 매장과 애견 미용 서비스
                        이용자(이하 보호자)는 상호 간의 미용서비스와 관련하여
                        다음과 같이 동의를 계약합니다.
                      </p>
                      <p>
                        8살 이상의 반려견 들의 경우 노령화로 인한 질병 및
                        견주분들께서 미처 알지 못하고 계신 각종질환이 있을 수
                        있으며, 급작스런 스트레스로 인한 질환의 악화나
                        응급상황이 발생할 수 있음을 인지합니다.
                      </p>
                      <p>
                        그로 인해 원치 않는 일(스트레스 질환 및 쇼크사 등)이
                        발생할 수 있으므로, 본매장에서는 견주분으로부터 미용
                        중/미용 후 발생한 모든 책임(민,형사상 포함)을 묻지 않을
                        것임을 약속 받고 미용 해 드리고 있습니다.
                      </p>
                      <p>
                        본 매장은 반려견을 미용 함에 있어 소홀하지 않을 것 이며
                        반려견의 나이 및 노령화를 감안하여 최대한 배려하여 미용
                        할 것을 약속 드립니다.
                      </p>
                      <p>
                        동의서를 작성하셨더라도 반려견의 컨디션이나 건강상태가
                        좋지 않아 보일 시에는 미용사의 판단에 따라 미용이 중단
                        되실 수 있음을 인지합니다.
                      </p>
                      <p>
                        본 동의서는 1회 작성시 작성된 날로부터 차후 미용실을
                        이용하시는 기간 동안 적용이 됨을 알려드립니다.
                      </p>
                      <p>
                        애견 미용 시 발생할 수 있는 사고와 미용 후 스트레스
                        증후군에 대해 보호자는 인지를 하고 이해를 했으며 애견
                        미용 서비스를 이용하는 것을 동의합니다.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p>
                        애견 미용 서비스를 제공하는 매장과 애견 미용 서비스
                        이용자(이하 보호자)는 상호 간의 미용 서비스와 관련하여
                        다음과 같이 동의를 계약합니다.
                      </p>
                      <p>
                        1. 정도의 차이가 있지만 미용 후 스트레스를 받지 않는
                        강아지는 거의 없다고 해도 과언이 아닙니다.{" "}
                      </p>
                      <p>
                        {" "}
                        따라서 아래와 같은 미용 후 스트레스 증후군이 발생할 수
                        있음을 인지합니다.
                      </p>
                      <p>
                        - 평소보다 발가락, 얼굴, 꼬리 등을 핥거나 많이 긁는 현상
                      </p>
                      <p> - 식욕부진, 구토 및 설사, 불안, 초조, 예민 현상</p>
                      <p> - 항문을 바닥에 끌고 다니거나 꼬리를 감추는 현상</p>
                      <p> - 눈의 흰자위가 붉어지는 증상</p>
                      <p>
                        {" "}
                        - 이중모, 단모 강아지의 경우 클리퍼 사용 시 탈모 증상
                      </p>
                      <p> - 체질에 따라 알러지성 피부염 증상</p>
                      <p>
                        {" "}
                        (1~2주 안에 위와 같은 증상은 사라지며 2주 이상 지속되는
                        경우 인근 동물 병원에 내방해주시기 바랍니다.)
                      </p>
                      <p>
                        2. 강아지의 모발 상태에 따라 원하는 스타일이 똑같이 안
                        나올 수 있음을 인지합니다.
                      </p>
                      <p>
                        3. 엉킨털이 있는 경우 푸는 데 시간이 오래 걸리고,
                        제거하다가 날이 손상되는 경우가 있기 때문에 엉킨털 미용
                        비용이 추가 발생할 수 있음을 인지합니다.
                      </p>
                      <p>
                        4. 미용 후 털에 감추어진 피부병이 발견될 수 있습니다.
                        이는 미용으로 인한 피부병이 아님을 인지합니다.
                      </p>
                      <p>
                        5. 강아지는 사람과 다르게 미용 중 계속 움직이다 보니
                        작은 스크래치가 생길 수 있음을 인지합니다.{" "}
                      </p>
                      <p>
                        {" "}
                        또한 해당 매장은 위 사례 외 미용 중 사고로 강아지에게
                        발생하는 상해에 대한 치료비는 보상해드립니다.
                      </p>
                      <p>
                        {" "}
                        (미용 중에 발생한 상해에 따른 반려동물 치료비 외에 그
                        밖의 보호자에 대한 위자료나 기타 비용은 적용되지
                        않습니다.)
                      </p>
                      <p>
                        6. 입질, 산만함 등 미용 거부 행동이 심한 경우 미용사가
                        상해를 입을 수 있습니다.
                      </p>
                      <p>
                        {" "}
                        미용사가 물리면 정도에 따라 정상적인 영업 활동을
                        못하기에 손해배상 청구가 발생할 수 있음을 인지합니다.
                      </p>
                      <p>
                        <br />
                      </p>
                      <p>
                        <strong>
                          {" "}
                          애견 미용 시 발생할 수 있는 사고와 미용 후 스트레스
                          증후군에 대해{" "}
                        </strong>
                      </p>
                      <p>
                        <strong>
                          {" "}
                          보호자는 인지를 하고 이해를 했으며 애견 미용 서비스를
                          이용하는 것을 동의합니다.
                        </strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="consent-terms mt-4">
                <div className="consent-terms-content mr-2 flex items-center">
                  <div className="consent-terms-left flex-1 text-lg">
                    개인정보 수집 및 이용 동의 (필수)
                  </div>
                  <label>
                    <input
                      type="checkbox"
                      checked={personalInfoChecked}
                      onChange={() =>
                        handleIndividualCheckedChange(
                          setPersonalInfoChecked,
                          personalInfoChecked,
                        )
                      }
                      className="mr-2 h-6 w-6"
                    />
                  </label>
                </div>
                <div className="consent-terms-template-primary max-h-48 overflow-y-auto border p-4">
                  <p>
                    이리온댕댕(이하 &quot;회사&quot;)는 대상 매장 예약 처리를
                    위해 아래와 같은 개인정보를 수집하고 있습니다.
                  </p>
                  <ol>
                    <li>
                      예약 처리를 위한 수집항목 - 고객명, 전화번호, 예약 매장,
                      예약 일시, 반려동물명, 품종, 성별, 동물 등록번호, 중성화
                      수술 여부, 생년월일, 주소
                    </li>
                    <li>
                      서비스 이용 공통 수집항목 - 서비스 이용기록, 접속로그,
                      접속 IP정보, 쿠키(cookie)
                    </li>
                  </ol>
                  <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
                  <ol>
                    <li>대상 매장 예약 처리</li>
                    <li>대상 매장 이용 시 본인 확인</li>
                    <li>이용불편사항 처리</li>
                    <li>동의서 작성 및 동의서 정보 처리</li>
                    <li>신규 서비스 개발</li>
                  </ol>
                  <p>
                    회사는 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를
                    지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의
                    이유로 명시한 기간 동안 보존합니다.
                  </p>
                  <ul>
                    <li>보관 정보 : 아이핀, CI등 본인 확인을 위한 정보</li>
                    <li>
                      보관 목적 : 재방문 고객의 본인확인, 불량 이용자의 서비스
                      이용, 명예훼손, 권리침해 분쟁 및 수사협조, 사용고객의
                      부정이용 방지
                    </li>
                    <li>보관 기간 : 1년</li>
                  </ul>
                  <ul>
                    <li>
                      서비스 이용기록, 접속로그, 접속 IP정보 : 3개월
                      (통신비밀보호법)
                    </li>
                    <li>
                      표시, 광고에 관한 기록 : 6개월 (전자상거래 등에서의
                      소비자보호에 관한 법률)
                    </li>
                    <li>
                      계약 또는 청약철회 등에 관한 기록 : 5년 (전자상거래
                      등에서의 소비자보호에 관한 법률)
                    </li>
                    <li>
                      대금결제 및 재화 등의 공급에 관한 기록 : 5년 (전자상거래
                      등에서의 소비자보호에 관한 법률)
                    </li>
                    <li>
                      소비자의 불만 또는 분쟁처리에 관한 기록 : 3년 (전자상거래
                      등에서의 소비자보호에 관한 법률)
                    </li>
                  </ul>
                  <p>
                    동의를 거부하실 권리가 있으나 위 개인정보의 수집 및 이용에
                    대한 동의는 매장 예약을 위하여 필수적이므로, 동의를 거부하실
                    경우 매장 이용을 위한 동의서 작성이 불가능 합니다.
                  </p>
                </div>
              </div>
              <div className="consent-terms mt-4">
                <div className="consent-terms-content mr-2 flex items-center">
                  <div className="consent-terms-left flex-1 text-lg">
                    개인정보 제3자 제공 동의 (필수)
                  </div>
                  <label>
                    <input
                      type="checkbox"
                      checked={thirdPartyChecked}
                      onChange={() =>
                        handleIndividualCheckedChange(
                          setThirdPartyChecked,
                          thirdPartyChecked,
                        )
                      }
                      className="mr-2 h-6 w-6"
                    />
                  </label>
                </div>
                <div className="consent-terms-template-primary max-h-48 overflow-y-auto border p-4">
                  <p>
                    이리온댕댕(이하 &quot;회사&quot;)는 이용자의 개인정보를 본
                    개인정보취급방침에서 고지한 범위 내에서 사용하며, 이용자의
                    사전 동의 없이 동 범위를 초과하여 이용하거나 이용자의 개인
                    정보를 제3자에게 제공하지 않습니다. 다만, 관련 법령에
                    의하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라
                    수사기관 등에 개인정보를 제공하여야 하는 경우는 예외로
                    합니다. 회사의 서비스 이행을 위하여 개인정보를 제3자에게
                    제공하고 있는 경우는 다음과 같습니다.
                  </p>
                  <ol>
                    <li>
                      제공목적 : 본인 여부 확인, 서비스 이행을 위한 연락 및
                      안내, 고지 사항 전달, 분쟁 및 불만처리 등의 의사소통 경로,
                      부정 이용자(고의적 노쇼) 제재 및 거래 방지, 약관 변경 등
                      고지, 통계자료 작성 및 고객 맞춤 서비스를 개발/제공하기
                      위한 자료, 동의서 작성, 동의서 작성 및 관리, 신규 서비스
                      개발
                    </li>
                    <li>제공받는 자 : 예약 매장</li>
                    <li>
                      제공정보 : 이름, 연락처, 서비스 이용 기록, 반려동물명,
                      품종, 성별, 동물 등록번호, 중성화 수술 여부, 생년월일,
                      주소 등
                    </li>
                    <li>
                      보유기간 : 서비스 제공 기간(관계법령의 규정에 의하여
                      보존할 필요가 있는 경우 해당 기간만큼 보관)
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(2)}
        >
          이전
        </Button>
        <DialogTrigger asChild>
          <Button
            type="button"
            className="flex-1 bg-primary"
            disabled={!allChecked}
          >
            강아지 추가하기
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="gap-2 text-start">
            <DialogTitle>보호자 서명</DialogTitle>
            <DialogDescription className="break-all">
              애견 미용 시 발생할 수 있는 사고와 미용 후 스트레스 증후군에 대해,
              보호자는 인지를 하고 이해를 했으며 애견 미용 서비스를 이용하는
              것을 동의합니다.
            </DialogDescription>
          </DialogHeader>
          <SignatureBox ref={signaturePadRef} />
          <DialogFooter className="gap-4">
            {/* <Button type='button' variant='secondary' onClick={handleUndo}>
              Undo
            </Button> */}
            <Button type="button" variant="secondary" onClick={handleClear}>
              초기화
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              제출
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default ConsentForm;
