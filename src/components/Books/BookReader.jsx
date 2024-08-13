import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ePub from "epubjs";
import api from "../../api";
import { debounce } from "debounce";

const BookReader = () => {
  const { book_id } = useParams();
  const bookRef = useRef(null);
  const [rendition, setRendition] = useState(null);
  const [progress, setProgress] = useState(0);
  const [highlights, setHighlights] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [bookInstance, setBookInstance] = useState(null);

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
        setRendition(null); // Clean up the state
      }
    };
  }, [book_id]);

  useEffect(() => {
    const checkSpineItems = async () => {
      if (bookInstance) {
        try {
          await bookInstance.spine.ready; // Ensure spine is loaded
          const spineItems = bookInstance.spine.spineItems;
          console.log("Spine items:", spineItems);

          // Log details of each spine item
          spineItems.forEach((item, index) => {
            console.log(`Spine item ${index}:`, item);
            console.log(`Href: ${item.href}`);
            console.log(`ID: ${item.id}`);
          });
        } catch (error) {
          console.error("Error loading spine items:", error);
        }
      }
    };

    checkSpineItems();
  }, [bookInstance]);

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

          const updateLocation = () => {
            requestAnimationFrame(() => {
              const location = newRendition.currentLocation();
              console.log("Current Location:", location);

              if (location && location.start && location.start.cfi) {
                setCurrentLocation(location);

                const progressPercentage =
                  bookInstance.locations.percentageFromCfi(location.start.cfi) *
                  100;
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

          // Ensure spineItems are loaded and valid
          await bookInstance.spine.ready;
          const spineItems = bookInstance.spine.spineItems;
          if (spineItems.length > 0) {
            console.log("Displaying first spine item:", spineItems[0].href);
            // Display the first spine item
            await newRendition.display(spineItems[0].href);
            console.log("Book displayed.");
            setRendition(newRendition);
          } else {
            console.error("No spine items found.");
          }

          /* Display the first spine item
          await newRendition.display();
          console.log("First spine item displayed.");
          setRendition(newRendition);

          // Clean up observer
          return () => resizeObserver.disconnect(); */
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
    }
  };

  const handlePreviousPage = () => {
    if (rendition) {
      rendition.prev();
    }
  };

  const handleHighlight = () => {
    if (
      rendition &&
      currentLocation &&
      currentLocation.start &&
      currentLocation.start.cfi
    ) {
      console.log("Highlighting at CFI:", currentLocation.start.cfi);
      rendition.annotations.highlight(
        currentLocation.start.cfi,
        {},
        () => {
          setHighlights([...highlights, currentLocation.start.cfi]);
          console.log("Highlight added.");
        },
        "highlight"
      );
    } else {
      console.warn("Cannot highlight: currentLocation or CFI is undefined.");
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
    </div>
  );
};

export default BookReader;
