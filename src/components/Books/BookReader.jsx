import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ePub from "epubjs";
import api from "../../api"; // Axios 인스턴스 import

const BookReader = () => {
  const { book_id } = useParams();
  const bookRef = useRef(null);
  const [rendition, setRendition] = useState(null);
  const [progress, setProgress] = useState(0);
  const [highlights, setHighlights] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const fileUrlRef = useRef(null); // 추가된 부분: fileUrl 생성 상태 추적

  /*파일 다운로드해서 정상인지 보기 위함 --> 확인됨
  const downloadBlob = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "your_book.epub"; // 원하는 파일 이름
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }; */

  useEffect(() => {
    const fetchBook = async () => {
      console.log("Fetching book data...");
      try {
        const contentResponse = await api.get(`/books/${book_id}/content`, {
          responseType: "blob", // Ensure responseType is 'blob'
          headers: {
            Accept: "application/epub+zip", // Expect EPUB file
          },
        });

        // 파일의 MIME 타입 확인
        console.log("Content-Type:", contentResponse.headers["content-type"]);
        console.log("Blob Size:", contentResponse.data.size);

        // 응답 상태 확인
        if (
          contentResponse.status === 200 &&
          contentResponse.headers["content-type"] === "application/epub+zip"
        ) {
          const blob = contentResponse.data;

          // Check if blob is empty or not
          if (blob.size > 0) {
            const newFileUrl = URL.createObjectURL(blob);
            // fileUrl이 이미 생성되었는지 확인하고, 생성되지 않았다면 생성
            if (!fileUrlRef.current) {
              console.log("Setting fileUrl: ", newFileUrl);
              fileUrlRef.current = newFileUrl;
              setFileUrl(newFileUrl);
            }
            //downloadBlob(fileUrl);
          } else {
            console.error("Blob is empty or not valid.");
          }
        } else {
          console.error("Invalid response type or status.");
        }
      } catch (error) {
        console.error("Failed to fetch book data:", error);
      }
    };

    // book_id가 변경될 때만 fetchBook 호출
    if (book_id) {
      fetchBook();
    }

    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl); // 언마운트 시 Blob URL 해제
      }
    };
  }, [book_id]);

  useEffect(() => {
    const validateBlobUrl = async (blobUrl) => {
      try {
        const response = await fetch(blobUrl);
        if (response.ok) {
          const blob = await response.blob();
          console.log("Blob URL is valid and file size is:", blob.size);
        } else {
          console.error("Failed to fetch Blob URL:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching Blob URL:", error);
      }
    };

    if (fileUrl) {
      validateBlobUrl(fileUrl);
    }
  }, [fileUrl]);

  // 전자책 렌더링
  useEffect(() => {
    const renderBook = async () => {
      if (fileUrl && bookRef.current) {
        try {
          if (rendition) {
            rendition.destroy(); // 기존 rendition 제거
            setRendition(null);
          }

          const bookInstance = ePub(fileUrl);
          console.log("Book Instance created:", bookInstance);

          // 에러 핸들링
          bookInstance.on("error", (error) => {
            console.error("ePub error:", error);
          });

          // opened, ready 등 주요 promise 처리 확인
          await bookInstance.opened
            .then(() => {
              console.log("Book opened successfully");
            })
            .catch((error) => {
              console.error("Error opening book:", error);
            });

          await bookInstance.ready
            .then(() => {
              console.log("Book is ready");
            })
            .catch((error) => {
              console.error("Error getting book ready:", error);
            });

          const renditionInstance = bookInstance.renderTo(bookRef.current, {
            flow: "scrolled-doc",
            width: "100%",
            height: "100%",
            allowScriptedContent: true,
          });

          await renditionInstance.started
            .then(() => {
              console.log("Rendition started successfully");
            })
            .catch((error) => {
              console.error("Error starting rendition:", error);
            });

          const updateLocation = () => {
            const location = renditionInstance.currentLocation();
            setCurrentLocation(location);

            const progressPercentage =
              bookInstance.locations.percentageFromCfi(location.start.cfi) *
              100;
            setProgress(progressPercentage);
          };

          renditionInstance.on("rendered", updateLocation);
          renditionInstance.display(); // 첫 페이지 또는 섹션 표시
          setRendition(renditionInstance);
        } catch (error) {
          console.error("Error in rendering book:", error);
        }
      }
    };

    renderBook();
  }, [fileUrl]);

  // 형광펜
  const handleHighlight = () => {
    if (rendition && currentLocation) {
      rendition.annotations.highlight(
        currentLocation.start.cfi,
        {},
        (e) => {
          setHighlights([...highlights, currentLocation.start.cfi]);
        },
        "highlight"
      );
    }
  };

  // 북마크, 배열로 관리됨
  const handleBookmark = () => {
    if (currentLocation) {
      setBookmarks([...bookmarks, currentLocation.start.cfi]);
    }
  };

  // 북마크로 이동
  const goToBookmark = (cfi) => {
    if (rendition) {
      rendition.display(cfi);
    }
  };

  return (
    <div className="book-reader">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div>진도율: {progress.toFixed(2)}%</div>
        <div>
          <button onClick={handleHighlight}>형광펜</button>
          <button onClick={handleBookmark}>북마크</button>
        </div>
      </div>
      <div
        ref={bookRef}
        style={{ width: "100%", height: "600px", border: "1px solid #ddd" }}
      ></div>
      <div style={{ marginTop: "10px" }}>
        <h3>북마크:</h3>
        <ul>
          {bookmarks.map((cfi, index) => (
            <li key={index} onClick={() => goToBookmark(cfi)}>
              북마크 {index + 1}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookReader;
