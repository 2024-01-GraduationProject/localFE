import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ePub from "epubjs";
import api from "../../api";
import { debounce } from "debounce";
import { useAuth } from "../../AuthContext";

const BookReader = () => {
  const { book_id } = useParams();
  const bookRef = useRef(null);
  const [rendition, setRendition] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [bookInstance, setBookInstance] = useState(null);
  const { isAuthenticated } = useAuth(); // 인증 상태 가져오기
  const [bookmarks, setBookmarks] = useState([]);

  // 책 로드, 인스턴스 생성
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${book_id}/content`, {
          responseType: "arraybuffer",
          headers: { Accept: "application/epub+zip" },
        });

        if (response.status === 200) {
          const arrayBuffer = response.data;
          const book = ePub(arrayBuffer);

          book.on("error", (error) => {
            console.error("ePub error:", error);
          });

          await book.loaded.metadata;
          console.log("Book metadata loaded.");

          // 여기서 book.loaded를 사용하여 초기화가 완료되었는지 확인합니다.
          await book.ready;
          console.log("Book metadata loaded.");

          setBookInstance(book);
        } else {
          console.error("Invalid response type or status.");
        }
      } catch (error) {
        console.error("Failed to fetch book data:", error);
      }
    };

    if (book_id) {
      fetchBook();
    }

    return () => {
      if (rendition) {
        rendition.destroy();
        setRendition(null); // 초기화
      }
    };
  }, [book_id]);

  // 책 렌더링
  useEffect(() => {
    const renderBook = async () => {
      if (bookInstance && bookRef.current) {
        try {
          if (rendition) {
            console.log("Destroying previous rendition...");
            rendition.destroy();
          }

          await bookInstance.ready;
          console.log("Book ready.");

          const newRendition = bookInstance.renderTo(bookRef.current, {
            //method: "continuous",
            width: "100%",
            height: "100%",
            flow: "paginated", //"scrolled-doc", // Set flow to paginated
            allowScriptedContent: true,
            //spread: "none",
            interaction: {
              enabled: true, // 상호작용 기능을 활성화
            },
          });

          setRendition(newRendition);

          const handleResize = debounce(() => {
            if (newRendition) {
              try {
                newRendition.resize();
              } catch (error) {
                console.error("Failed to resize rendition:", error);
              }
            }
          }, 200);

          const resizeObserver = new ResizeObserver(() => {
            handleResize();
          });

          resizeObserver.observe(bookRef.current);

          //spineItem index 기반 진도율 -> 세세한 진도율 측정 불가
          const updateLocation = () => {
            requestAnimationFrame(() => {
              const location = newRendition.currentLocation();
              console.log("Current Location:", location);

              if (location && location.start && location.start.cfi) {
                setCurrentLocation(location);

                // 진도율 계산
                if (bookInstance.spine) {
                  const spineItems = bookInstance.spine.spineItems;
                  const currentIndex = spineItems.findIndex(
                    (item) => item.href === location.start.href
                  );
                  if (currentIndex !== -1 && spineItems.length > 0) {
                    const progressPercentage =
                      (currentIndex / (spineItems.length - 1)) * 100;
                    setProgress(progressPercentage);
                  } else {
                    console.warn(
                      "Cannot determine current index in spine items."
                    );
                  }
                } else {
                  console.warn("Spine items are not available.");
                }
              } else {
                console.warn("Location or CFI is undefined.");
              }
            });
          };

          newRendition.on("rendered", (section) => {
            console.log("Section rendered:", section);
            updateLocation();
            restoreBookmarks(newRendition); // 페이지 로드 후 북마크 복구
          });

          newRendition.on("relocated", (location) => {
            console.log("Relocated to:", location);
            updateLocation();
          });

          console.log("Rendition instance created and listener attached.");

          // Ensure spineItems are loaded and valid
          await bookInstance.spine.ready;
          const spineItems = bookInstance.spine.spineItems;
          if (spineItems.length > 0) {
            console.log("Displaying first spine item:", spineItems[0].href);
            // 표지 [0] 부터 보여주기
            await newRendition.display(spineItems[0].href);
            console.log("Book displayed.");
            setRendition(newRendition);
          } else {
            console.error("No spine items found.");
          }
        } catch (error) {
          console.error("Error in rendering book:", error);
        }
      }
    };

    renderBook();
  }, [bookInstance]);

  // 북마크 추가
  const addBookmark = async () => {
    if (rendition) {
      const location = rendition.currentLocation();
      if (location && location.start && location.start.cfi) {
        const newBookmark = {
          cfi: location.start.cfi,
          title: `Bookmark at ${Math.round(progress)}%`, // 북마크 제목
        };

        // 북마크를 상태에 저장
        setBookmarks((prev) => [...prev, newBookmark]);
        console.log("Bookmark added:", newBookmark);
      } else {
        console.warn("Cannot determine current location.");
      }
    } else {
      console.warn("Rendition is not initialized.");
    }
  };

  // 북마크 복구
  const restoreBookmarks = (rendition) => {
    bookmarks.forEach((bookmark) => {
      rendition.annotations.add(
        bookmark.cfi,
        "bookmark",
        { ignoreClass: "" },
        () => {
          console.log("Bookmark restored:", bookmark);
        }
      );
    });
  };

  /* 하이라이트 추가 - 텍스트 CFI 기반
  const addHighlight = async () => {
    if (rendition) {
      const cfiRange = await rendition.getRange(); // 선택한 범위 가져오기
      if (cfiRange) {
        const highlight = {
          cfiRange,
          class: "highlight",
        };
        // 하이라이트 적용
        rendition.annotations.add(highlight.cfiRange, { class: "highlight" });
        setHighlights((prev) => [...prev, highlight]);
      }
    } else {
      console.warn("Rendition is not initialized.");
    }
  }; */

  // 다음 페이지
  const handleNextPage = () => {
    if (rendition) {
      rendition.next();
    } else {
      console.warn("Rendition is not initialized.");
    }
  };

  // 이전 페이지
  const handlePreviousPage = () => {
    if (rendition) {
      rendition.prev();
    } else {
      console.warn("Rendition is not initialized.");
    }
  };

  return (
    <div className="book-reader">
      <button className="nav-button left" onClick={handlePreviousPage}>
        이전
      </button>
      <div ref={bookRef} className="book-container"></div>
      <button className="nav-button right" onClick={handleNextPage}>
        다음
      </button>
      <button className="bookmark-button" onClick={addBookmark}>
        북마크 추가
      </button>

      {/*<button className="highlight-button" onClick={addHighlight}>
        하이라이트 추가
      </button> */}

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        <div className="progress-text" style={{ left: `${progress}%` }}>
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};

export default BookReader;
