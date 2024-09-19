import React from "react";

const CustomModal = ({
  type,
  onConfirm,
  onCancel,
  onOptionNavigate,
  userId,
  bookId,
}) => {
  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal-content">
        {type === "confirm" && (
          <div>
            <p>다시 읽으시겠습니까?</p>
            <button onClick={onConfirm}>예</button>
            <button onClick={onCancel}>아니오</button>
          </div>
        )}
        {type === "options" && (
          <div>
            <p>다음 작업을 선택하세요:</p>
            <button
              onClick={() =>
                onOptionNavigate(`/boogi/answers/${userId}/${bookId}`)
              }
            >
              부기와의 대화 보러가기
            </button>
            <button onClick={() => onOptionNavigate("/mainview")}>
              메인화면으로 이동하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomModal;
