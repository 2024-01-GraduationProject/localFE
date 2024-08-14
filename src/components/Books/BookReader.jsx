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
  const [highlights, setHighlights] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [bookInstance, setBookInstance] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const { isAuthenticated } = useAuth(); // 인증 상태 가져오기

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

          const handleResize = debounce(() => {
            if (newRendition) {
              newRendition.resize();
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

            // Apply existing highlights
            highlights.forEach((highlight) => {
              newRendition.annotations.highlight(highlight.cfi, {}, () => {
                console.log("Highlight applied:", highlight.cfi);
              });
            });
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

  /*하이라이팅
  const handleHighlight = async () => {
    if (
      rendition &&
      currentLocation &&
      currentLocation.start &&
      currentLocation.start.cfi
    ) {
      console.log("Highlighting at CFI:", currentLocation.start.cfi);

      const highlight = {
        cfi: currentLocation.start.cfi,
        text: await rendition.getSelectionText(),
      };

      // Add highlight to state
      setHighlights([...highlights, highlight]);

      // Add highlight to the book with custom style
      rendition.annotations.highlight(
        currentLocation.start.cfi,
        {},
        () => console.log("Highlight added."),
        "highlight"
      );

      // Optionally: Save the highlight to server
      try {
        await api.post("/highlights", highlight);
      } catch (error) {
        console.error("Failed to save highlight:", error);
      }
    } else {
      console.warn("Cannot highlight: currentLocation or CFI is undefined.");
    }
  }; */

  return (
    <div className="book-reader">
      <button className="nav-button left" onClick={handlePreviousPage}>
        이전
      </button>
      <div ref={bookRef} className="book-container"></div>
      <button className="nav-button right" onClick={handleNextPage}>
        다음
      </button>

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
