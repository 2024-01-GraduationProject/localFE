import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header2, SearchBar, MainNav } from "components";
import { useAuth } from "AuthContext";

const SearchList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
  const [searchWord, setSearchWord] = useState(""); // 검색어 상태

  useEffect(() => {
    // 로컬 스토리지에서 로그인 상태 확인
    const token = localStorage.getItem("authToken");

    if (token) {
      setIsAuthenticated(true); // 로그인 상태 유지
    } else {
      navigate("/login"); // 로그인 상태가 아니라면 로그인 페이지로 이동
    }
  }, [navigate]);

  useEffect(() => {
    // 검색 결과가 state로 전달된 경우에 처리
    if (location.state && location.state.searchResults) {
      setSearchResults(location.state.searchResults);
      setSearchWord(location.state.searchWord);
    }
  }, [location.state]);

  const handleSearchResults = (results, query) => {
    setSearchResults(results); // 검색 결과를 상태에 저장
    setSearchWord(query); // 검색어를 상태에 저장
  };

  if (!isAuthenticated) {
    return <div>로딩 중...</div>; // 로딩 중 메시지 표시
  }

  const hasResults = searchResults.length > 0;

  return (
    <>
      <Header2 />
      <SearchBar onSearch={handleSearchResults} /> {/* 검색 결과 콜백 전달 */}
      <MainNav />
      <hr className="mainview_line" />
      {/* 검색 결과 표시 */}
      <div id="searchResults">
        {hasResults ? (
          <>
            <h2>"<span className="searchWord">{searchWord}</span>" 검색 결과입니다.</h2>
            <div className="mainview_wrapper">
              <div className="booksGrid">
                {searchResults.map((book) => (
                  <div key={book.book_id} className="bookItem">
                    <img
                      src={book.coverImageUrl}
                      alt={book.title}
                      className="bookCover"
                      onClick={() => navigate(`/books/details/${book.bookId}`)}
                    />
                    <div className="bookInfo">
                      <h3>{book.title}</h3>
                      <p>
                        {book.author} | {book.publisher}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="noResultsMessage">
            "<span className="searchWord">{searchWord}</span>" 검색 결과가 없습니다.
          </p>
        )}
      </div>
    </>
  );
};

export default SearchList;
