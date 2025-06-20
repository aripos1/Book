// ★★★★★ 최종 안정화 및 오류 수정 완료 버전 ★★★★★

// 설정 객체: 주요 설정값을 여기서 한번에 관리합니다.
const CONFIG = {
      SHEETS: {
            WORK: "업무_데이터",
                EVENT: "이벤트_데이터"
      },
        RANGES: { // 데이터 범위 고정 (안정성 확보)
            WORK: "A2:P",
                EVENT: "A2:I"
                  },
                    TIME_ZONE: "Asia/Seoul",
                      WORK_COLS: { // '업무_데이터' 시트의 열 번호 (0부터 시작)
                          DATE: 0,          // A열: 일자
                              TIME: 1,          // B열: 시간
                                  AUTHOR: 2,        // C열: 작성자
                                      TYPE: 3,          // D열: 유형
                                          CONTENT: 4,       // E열: 상세내용
                                              REMARKS: 14,      // O열: 비고
                                                  SEARCH_HELPER: 15 // P열: 검색용 헬퍼
                                                    },
                                                      EVENT_COLS: { // '이벤트_데이터' 시트의 열 번호 (0부터 시작)
                                                          NAME: 0,          // A열: 이벤트명
                                                              START_DATE: 1,    // B열: 시작일
                                                                  END_DATE: 2,      // C열: 종료일
                                                                      STATUS: 3,        // D열: 상태
                                                                          PAY_DATE: 4,      // E열: 지급일
                                                                              CONTENT: 5,       // F열: 내용
                                                                                  NOTICE: 6,        // G열: 유의사항
                                                                                      URL: 7,           // H열: URL
                                                                                          SEARCH_HELPER: 8  // I열: 검색용 헬퍼
                                                                                            }
};

/**
 * 웹 앱을 실행하는 기본 함수
  */
  function doGet() {
      return HtmlService.createHtmlOutputFromFile('index').setTitle("상담 스크립트 검색 시스템");
  }

  /**
   * '업무_데이터' 시트에서 중복을 제외한 '유형' 목록을 가져옵니다.
    */
    function getUniqueTypes() {
          try {
                const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.WORK);
                    if (!sheet) return [];
                        
                            const lastRow = sheet.getLastRow();
                                if (lastRow < 2) return [];
                                    
                                        const typesRange = sheet.getRange(2, CONFIG.WORK_COLS.TYPE + 1, lastRow - 1, 1);
                                            const types = typesRange.getValues();
                                                const uniqueTypes = [...new Set(types.flat())].filter(Boolean);
                                                    return uniqueTypes.sort();
          } catch(e) {
                return [];
          }
    }

    /**
     * '유형' 이름으로 '업무_데이터'를 필터링합니다.
      */
      function filterDataByType(typeName) {
          try {
                const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEETS.WORK);
                    if (!sheet) return { error: `'${CONFIG.SHEETS.WORK}' 시트를 찾을 수 없습니다.` };

                        const lastRow = sheet.getLastRow();
                            if (lastRow < 2) return [];
                                
                                    const rangeString = CONFIG.RANGES.WORK + lastRow;
                                        const dataValues = sheet.getRange(rangeString).getValues();
                                            const richTextValues = sheet.getRange(rangeString).getRichTextValues();
                                                
                                                    const results = [];
                                                        for (let i = 0; i < dataValues.length; i++) {
                                                                  if (dataValues[i][CONFIG.WORK_COLS.TYPE] === typeName) {
                                                                            const resultRow = processRow(dataValues[i], richTextValues[i], "업무 검색");
                                                                                    const originalDate = new Date(dataValues[i][CONFIG.WORK_COLS.DATE]);
                                                                                            if (originalDate && !isNaN(originalDate.getTime())) {
                                                                                                          results.push({ sortDate: originalDate, data: resultRow });
                                                                                            }
                                                                  }
                                                        }
                                                            
                                                                results.sort((a, b) => b.sortDate - a.sortDate);
                                                                    return results.map(item => item.data);
          } catch (e) {
                return { error: `[filterDataByType] ${e.message}` };
          }
      }

      /**
       * 키워드로 데이터를 검색합니다.
        */
        function searchData(searchType, searchTerm, searchField) {
              try {
                    const isWorkSearch = searchType === "업무 검색";
                        const sheetName = isWorkSearch ? CONFIG.SHEETS.WORK : CONFIG.SHEETS.EVENT;
                            const rangePrefix = isWorkSearch ? CONFIG.RANGES.WORK : CONFIG.RANGES.EVENT;
                                
                                    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
                                        if (!sheet) return { error: `'${sheetName}' 시트를 찾을 수 없습니다.` };

                                            const lastRow = sheet.getLastRow();
                                                if (lastRow < 2) return [];

                                                    const rangeString = rangePrefix + lastRow;
                                                        const dataValues = sheet.getRange(rangeString).getValues();
                                                            const richTextValues = sheet.getRange(rangeString).getRichTextValues();
                                                                
                                                                    if (!searchTerm || !searchTerm.trim()) return [];
                                                                        const keywords = searchTerm.split(',').map(kw => kw.trim().toLowerCase()).filter(Boolean);

                                                                            const results = [];
                                                                                for (let i = 0; i < dataValues.length; i++) {
                                                                                          const row = dataValues[i];
                                                                                                let searchableText = '';
                                                                                                      let helperCol;

                                                                                                            if (isWorkSearch) {
                                                                                                                        if (searchField === '유형') searchableText = row[CONFIG.WORK_COLS.TYPE];
                                                                                                                                else if (searchField === '상세내용') searchableText = row[CONFIG.WORK_COLS.CONTENT];
                                                                                                                                        else searchableText = row[CONFIG.WORK_COLS.SEARCH_HELPER];
                                                                                                            } else {
                                                                                                                        searchableText = row[CONFIG.EVENT_COLS.SEARCH_HELPER];
                                                                                                            }
                                                                                                                  
                                                                                                                        if (searchableText && keywords.some(kw => searchableText.toString().toLowerCase().includes(kw))) {
                                                                                                                                    const resultRow = processRow(row, richTextValues[i], searchType);
                                                                                                                                            const dateColIndex = isWorkSearch ? CONFIG.WORK_COLS.DATE : CONFIG.EVENT_COLS.START_DATE;
                                                                                                                                                    const originalDate = new Date(row[dateColIndex]);
                                                                                                                                                            
                                                                                                                                                                    if (originalDate && !isNaN(originalDate.getTime())) {
                                                                                                                                                                                  results.push({ sortDate: originalDate, data: resultRow });
                                                                                                                                                                    }
                                                                                                                        }
                                                                                }

                                                                                    results.sort((a, b) => b.sortDate - a.sortDate);
                                                                                        return results.map(item => item.data);
              } catch (e) {
                    return { error: `[searchData] ${e.message}` };
              }
        }

        /**
         * (헬퍼 함수) 데이터 행 하나를 프론트엔드로 보낼 형식으로 가공합니다.
          */
          function processRow(rowValues, richTextRow, searchType) {
              const resultRow = [];
                
                  if (searchType === "업무 검색") {
                        const desiredIndices = [
                                  CONFIG.WORK_COLS.DATE, CONFIG.WORK_COLS.TIME, CONFIG.WORK_COLS.AUTHOR,
                                        CONFIG.WORK_COLS.TYPE, CONFIG.WORK_COLS.CONTENT, CONFIG.WORK_COLS.REMARKS
                        ];
                            for (const index of desiredIndices) {
                                      let textValue = rowValues[index];
                                            if (index === CONFIG.WORK_COLS.DATE && textValue) {
                                                        textValue = Utilities.formatDate(new Date(textValue), CONFIG.TIME_ZONE, "yyyy.MM.dd");
                                            } else if (index === CONFIG.WORK_COLS.TIME && textValue) {
                                                        textValue = Utilities.formatDate(new Date(textValue), CONFIG.TIME_ZONE, "HH:mm");
                                            }
                                                  resultRow.push({ text: textValue, url: richTextRow[index] ? richTextRow[index].getLinkUrl() : null });
                            }
                  } else { // 이벤트 검색
                      const desiredIndices = [
                              CONFIG.EVENT_COLS.NAME, CONFIG.EVENT_COLS.START_DATE, CONFIG.EVENT_COLS.END_DATE,
                                    CONFIG.EVENT_COLS.STATUS, CONFIG.EVENT_COLS.PAY_DATE, CONFIG.EVENT_COLS.CONTENT,
                                          CONFIG.EVENT_COLS.NOTICE, CONFIG.EVENT_COLS.URL
                      ];
                          const dateIndices = [CONFIG.EVENT_COLS.START_DATE, CONFIG.EVENT_COLS.END_DATE, CONFIG.EVENT_COLS.PAY_DATE];
                              for (const index of desiredIndices) {
                                      let textValue = rowValues[index];
                                            if (dateIndices.includes(index) && textValue) {
                                                        textValue = Utilities.formatDate(new Date(textValue), CONFIG.TIME_ZONE, "yyyy.MM.dd");
                                            }
                                                  resultRow.push({ text: textValue, url: richTextRow[index] ? richTextRow[index].getLinkUrl() : null });
                              }
                  }
                    return resultRow;
          }
          
                                            }
                              }
                      ]}
                                            }
                                            }
                            }
                        ]
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