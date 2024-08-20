import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ePub from "epubjs";
import api from "../../api";
import { debounce } from "debounce";
import { useAuth } from "../../AuthContext";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";

const BookReader = () => {
  const { book_id } = useParams();
  const bookRef = useRef(null);
  const [rendition, setRendition] = useState(null);
  const [progress, setProgress] = useState(0);
  const [bookInstance, setBookInstance] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

          await book.ready;
          console.log("Book ready.");

          // 전체 페이지 수 계산
          await book.locations.generate(1600); // 1600은 기준점(텍스트 길이 기준)
          setTotalPages(book.locations.total);

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
        try {
          rendition.destroy();
        } catch (error) {
          console.error("Error destroying rendition:", error);
        }
        setRendition(null);
      }
    };
  }, [book_id]);

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
            width: "100%",
            height: "100%",
            flow: "paginated",
            allowScriptedContent: true,
            interaction: {
              enabled: true,
            },
          });

          setRendition(newRendition);

          const handleResize = debounce(() => {
            if (newRendition) {
              try {
                newRendition.resize();
              } catch (error) {
                console.warn("Failed to resize rendition:", error);
              }
            }
          }, 200);

          const resizeObserver = new ResizeObserver(() => {
            handleResize();
          });

          resizeObserver.observe(bookRef.current);

          const updateLocation = () => {
            requestAnimationFrame(() => {
              const location = newRendition.currentLocation();
              console.log("Current Location:", location);

              if (location && location.start && location.start.cfi) {
                const currentPage = bookInstance.locations.percentageFromCfi(
                  location.start.cfi
                );
                setCurrentPage(currentPage);

                const progressPercentage = currentPage * 100;
                setProgress(progressPercentage);
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

          await bookInstance.spine.ready;
          const spineItems = bookInstance.spine.spineItems;
          if (spineItems.length > 0) {
            console.log("Displaying first spine item:", spineItems[0].href);
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

  const handleNextPage = () => {
    if (rendition) {
      rendition.next();
    } else {
      console.warn("Rendition is not initialized.");
    }
  };

  const handlePreviousPage = () => {
    if (rendition) {
      rendition.prev();
    } else {
      console.warn("Rendition is not initialized.");
    }
  };

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  return (
    <div className="book-reader">
      <button className="back-button" onClick={handleBack}>
        <FaRegArrowAltCircleLeft />
      </button>
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
