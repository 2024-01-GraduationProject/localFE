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

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${book_id}`);
        console.log("Fetched book data:", response.data);
        setBook(response.data);

        // Fetch the .epub file
        const contentResponse = await fetch(`/books/${book_id}/content`);
        const blob = await contentResponse.blob();
        const fileUrl = URL.createObjectURL(blob);
        console.log("File URL:", fileUrl);
        setFileUrl(fileUrl);
      } catch (error) {
        console.error("Failed to fetch book data:", error);
      }
    };

    fetchBook();
  }, [book_id]);

  // 전자책 렌더링
  useEffect(() => {
    const renderBook = () => {
      try {
        if (fileUrl) {
          const bookInstance = ePub(fileUrl);
          console.log("Book Instance:", bookInstance);

          const renditionInstance = bookInstance.renderTo(bookRef.current, {
            width: "100%",
            height: "100%",
          });
          console.log("Rendition Instance:", renditionInstance);

          //페이지 변경 시 현재 위치 및 진도율 업데이트
          renditionInstance.on("rendered", () => {
            const location = renditionInstance.currentLocation();
            setCurrentLocation(location);

            const progressPercentage =
              bookInstance.locations.percentageFromCfi(location.start.cfi) *
              100;
            setProgress(progressPercentage);
          });

          // 처음부터 읽기 시작
          renditionInstance.display();
          setRendition(renditionInstance);
        }
      } catch (error) {
        console.error("Error in useEffect: ", error);
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
