// ★★★★★ 4가지 기능 추가 최종 완성본 ★★★★★

function doGet() {
      return HtmlService.createHtmlOutputFromFile('index').setTitle("상담 스크립트 검색 시스템");
}

/**
 * '업무_데이터' 시트에서 중복을 제외한 '유형' 목록을 가져옵니다. (기능 4)
  */
  function getUniqueTypes() {
      try {
            const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("업무_데이터");
                const lastRow = sheet.getLastRow();
                    if (lastRow < 2) return [];
                        
                            const types = sheet.getRange("D2:D" + lastRow).getValues();
                                const uniqueTypes = [...new Set(types.flat())].filter(Boolean); // 빈 값 제외
                                    return uniqueTypes.sort(); // 가나다순 정렬
      } catch(e) {
            return []; // 오류 발생 시 빈 배열 반환
      }
  }

  /**
   * '유형' 이름으로 데이터를 필터링합니다. (기능 4)
    */
    function filterDataByType(typeName) {
          try {
                const ss = SpreadsheetApp.getActiveSpreadsheet();
                    const sheet = ss.getSheetByName("업무_데이터");
                        const lastRow = sheet.getLastRow();
                            if (lastRow < 2) return [];

                                const rangeString = "A2:P" + lastRow;
                                    const dataValues = sheet.getRange(rangeString).getValues();
                                        const richTextValues = sheet.getRange(rangeString).getRichTextValues();
                                            const TIME_ZONE = "Asia/Seoul";
                                                
                                                    const results = [];
                                                        
                                                            for (let i = 0; i < dataValues.length; i++) {
                                                                      let rowValues = dataValues[i];
                                                                            let richTextRow = richTextValues[i];
                                                                                  
                                                                                        // D열(인덱스 3)이 typeName과 일치하는지 확인
                                                                                              if (rowValues[3] === typeName) {
                                                                                                        let resultRow = [];
                                                                                                                const desiredIndices = [0, 1, 2, 3, 4, 14]; // A,B,C,D,E,O열
                                                                                                                        for (const index of desiredIndices) {
                                                                                                                                      let textValue = rowValues[index];
                                                                                                                                                if (index === 0 && textValue) textValue = Utilities.formatDate(new Date(textValue), TIME_ZONE, "yyyy.MM.dd");
                                                                                                                                                          if (index === 1 && textValue) textValue = Utilities.formatDate(new Date(textValue), TIME_ZONE, "HH:mm");
                                                                                                                                                                    resultRow.push({ text: textValue, url: richTextRow[index].getLinkUrl() });
                                                                                                                        }
                                                                                                                                // [기능 1] 정렬을 위해 원본 날짜 데이터와 함께 저장
                                                                                                                                        results.push({ sortDate: new Date(rowValues[0]), data: resultRow });
                                                                                              }
                                                            }
                                                                
                                                                    // [기능 1] 최신 날짜순으로 정렬
                                                                        results.sort((a, b) => b.sortDate - a.sortDate);
                                                                            
                                                                                return results.map(item => item.data); // 정렬 후 실제 데이터만 반환

          } catch (e) {
                return { error: e.toString() };
          }
    }

    /**
     * 키워드로 데이터를 검색합니다.
      * @param {string} searchType '업무 검색' 또는 '이벤트 검색'
       * @param {string} searchTerm 검색어
        * @param {string} searchField '업무 검색' 시 검색할 필드 ('전체', '유형', '상세내용')
         */
         function searchData(searchType, searchTerm, searchField) { // (기능 2) searchField 파라미터 추가
           try {
                const ss = SpreadsheetApp.getActiveSpreadsheet();
                    const results = [];
                        const TIME_ZONE = "Asia/Seoul";
                            
                                const sheetName = (searchType === "업무 검색") ? "업무_데이터" : "이벤트_데이터";
                                    const sheet = ss.getSheetByName(sheetName);

                                        const lastRow = sheet.getLastRow();
                                            if (lastRow < 2) return [];

                                                let rangeString = "";
                                                    let helperColIndex; // '전체' 검색을 위한 헬퍼 열

                                                        if (searchType === "업무 검색") {
                                                                  rangeString = "A2:P" + lastRow;
                                                                        helperColIndex = 15; // P열
                                                        } else { 
                                                                  rangeString = "A2:I" + lastRow;
                                                                        helperColIndex = 8; // I열
                                                        }
                                                            
                                                                const dataValues = sheet.getRange(rangeString).getValues();
                                                                    const richTextValues = sheet.getRange(rangeString).getRichTextValues();

                                                                        if (!searchTerm || searchTerm.trim() === "") return [];

                                                                            const keywords = searchTerm.split(',').map(kw => kw.trim().replace(/\s/g, '')).filter(kw => kw);
                                                                                
                                                                                    for (let i = 0; i < dataValues.length; i++) {
                                                                                              let rowValues = dataValues[i];
                                                                                                    let richTextRow = richTextValues[i];
                                                                                                          
                                                                                                                // [기능 2] 업무 검색 시, 선택된 필드에 따라 검색 대상 텍스트를 지정
                                                                                                                      let searchableText = '';
                                                                                                                            if (searchType === "업무 검색") {
                                                                                                                                        if (searchField === '유형') {
                                                                                                                                                      searchableText = rowValues[3]; // D열 (유형)
                                                                                                                                        } else if (searchField === '상세내용') {
                                                                                                                                                      searchableText = rowValues[4]; // E열 (상세내용)
                                                                                                                                        } else { // '전체'
                                                                                                                                                  searchableText = rowValues[helperColIndex];
                                                                                                                                                          }
                                                                                                                            } else { // 이벤트 검색
                                                                                                                                    searchableText = rowValues[helperColIndex];
                                                                                                                                          }
                                                                                                                                                
                                                                                                                                                      if (searchableText) {
                                                                                                                                                                let foundMatch = false;
                                                                                                                                                                        for (let j = 0; j < keywords.length; j++) {
                                                                                                                                                                                      if (searchableText.toString().toLowerCase().includes(keywords[j].toLowerCase())) {
                                                                                                                                                                                                    foundMatch = true;
                                                                                                                                                                                                                break;
                                                                                                                                                                                      }
                                                                                                                                                                        }
                                                                                                                                                                                
                                                                                                                                                                                        if (foundMatch) {
                                                                                                                                                                                                      let resultRow = [];
                                                                                                                                                                                                                if (searchType === "업무 검색") {
                                                                                                                                                                                                                                const desiredIndices = [0, 1, 2, 3, 4, 14]; // A,B,C,D,E,O열
                                                                                                                                                                                                                                            for (const index of desiredIndices) {
                                                                                                                                                                                                                                                              let textValue = rowValues[index];
                                                                                                                                                                                                                                                                            if (index === 0 && textValue) textValue = Utilities.formatDate(new Date(textValue), TIME_ZONE, "yyyy.MM.dd");
                                                                                                                                                                                                                                                                                          if (index === 1 && textValue) textValue = Utilities.formatDate(new Date(textValue), TIME_ZONE, "HH:mm");
                                                                                                                                                                                                                                                                                                        resultRow.push({ text: textValue, url: richTextRow[index].getLinkUrl() });
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                         // [기능 1] 정렬을 위해 원본 날짜 데이터와 함께 저장
                                                                                                                                                                                                                                                                     results.push({ sortDate: new Date(rowValues[0]), data: resultRow });
                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                } else { // 이벤트 검색
                                                                                                                                                                                                                            for (let k = 0; k < 8; k++) { // A-H열
                                                                                                                                                                                                                                          let textValue = rowValues[k];
                                                                                                                                                                                                                                                        const dateIndices = [1, 2, 4]; // B, C, E열
                                                                                                                                                                                                                                                                      if (dateIndices.includes(k) && textValue) {
                                                                                                                                                                                                                                                                                        textValue = Utilities.formatDate(new Date(textValue), TIME_ZONE, "yyyy.MM.dd");
                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                    resultRow.push({ text: textValue, url: richTextRow[k].getLinkUrl() });
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                         // [기능 1] 정렬을 위해 원본 날짜 데이터와 함께 저장 (B열 기준)
                                                                                                                                                                                                                                                     results.push({ sortDate: new Date(rowValues[1]), data: resultRow });
                                                                                                                                                                                                                }
                                                                                                                                                                                        }
                                                                                                                                                      }
                                                                                    }

                                                                                        // [기능 1] 최신 날짜순으로 정렬
                                                                                            results.sort((a, b) => b.sortDate - a.sortDate);
                                                                                                
                                                                                                    return results.map(item => item.data); // 정렬 후 실제 데이터만 반환

           } catch (e) {
                return { error: e.toString() };
           }
         }
         
           }
                                                                                                                                                                                                                                                                      }}}
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                }
                                                                                                                                                                                        }
                                                                                                                                                                                      }
                                                                                                                                                                        }
                                                                                                                                                      }
                                                                                                                                        }
                                                                                                                                        }
                                                                                                                            }
                                                                                    }
                                                        }
                                                        }
           }}
          }
                                                                                                                        }
                                                                                              }
                                                            }
          }
    }
      }
      }
  }
}