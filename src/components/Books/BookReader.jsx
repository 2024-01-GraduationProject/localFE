import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ePub from "epubjs";
import api from "../../api"; // Axios 인스턴스 import

const BookReader = () => {
  const { book_id } = useParams();
  const bookRef = useRef(null);
  const [book, setBook] = useState(null);
  const [rendition, setRendition] = useState(null);
  const [progress, setProgress] = useState(0);
  const [highlights, setHighlights] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  /* 파일 다운로드해서 정상인지 보기 위함 --> 확인됨
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
    console.log("Current book_id:", book_id);

    const fetchBook = async () => {
      console.log("Fetching book data...");
      try {
        /* const response = await api.get(`/books/${book_id}`);
        console.log("Fetched book data:", response.data);
        setBook(response.data); */

        // Fetch the .epub file
        //const timestamp = new Date().getTime(); ?ts=${timestamp} // 항상 새로운 요청으로 되도록(캐시 방지)
        const contentResponse = await api.get(`/books/${book_id}/content`, {
          responseType: "blob", // Make sure to set responseType to 'blob'
        });

        // 응답 상태 확인
        if (
          contentResponse.status === 200 &&
          contentResponse.headers["content-type"] === "application/epub+zip"
        ) {
          const blob = contentResponse.data;
          //console.log(blob.type);

          // Check if blob is empty or not
          if (blob.size > 0) {
            /*const fileUrl = URL.createObjectURL(blob);
            console.log("fileUrl: ", fileUrl); // URL 생성 후 로그 출력
            setFileUrl(fileUrl);*/
            const newFileUrl = URL.createObjectURL(blob);
            // fileUrl이 바뀌지 않도록 추가 조건 추가
            if (fileUrl !== newFileUrl) {
              console.log("Setting fileUrl: ", newFileUrl);
              if (fileUrl) {
                URL.revokeObjectURL(fileUrl); // 이전 URL 해제
              }
              setFileUrl(newFileUrl);
            } else {
              console.log("fileUrl has not changed");
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

  // 전자책 렌더링
  useEffect(() => {
    const renderBook = async () => {
      if (fileUrl && bookRef.current) {
        try {
          const bookInstance = ePub(fileUrl);
          console.log("Book Instance:", bookInstance);

          await bookInstance.opened.catch((error) => {
            console.error("Error opening book:", error);
          });
          console.log("Book opened successfully");

          await bookInstance.ready.catch((error) => {
            console.error("Error getting book ready:", error);
          });
          console.log("Book is ready");

          const renditionInstance = bookInstance.renderTo(bookRef.current, {
            width: "100%",
            height: "100%",
          });

          await renditionInstance.started.catch((error) => {
            console.error("Error starting rendition:", error);
          });
          console.log("Rendition started successfully");

          // Handle page rendering and progress updates
          const updateLocation = () => {
            const location = renditionInstance.currentLocation();
            setCurrentLocation(location);

            const progressPercentage =
              bookInstance.locations.percentageFromCfi(location.start.cfi) *
              100;
            setProgress(progressPercentage);
          };

          renditionInstance.on("rendered", updateLocation);
          renditionInstance.display(); // Display the first page or section
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
