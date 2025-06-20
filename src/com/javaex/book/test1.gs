// ★★★ 구문 오류 수정된 searchData 함수 ★★★
function searchData(searchType, searchTerm, searchField) {
      try {
            const ss = SpreadsheetApp.getActiveSpreadsheet();
                const sheetName = (searchType === "업무 검색") ? "업무_데이터" : "이벤트_데이터";
                    const sheet = ss.getSheetByName(sheetName);
                        if (!sheet) return { error: `'${sheetName}' 시트를 찾을 수 없습니다.` };

                            const lastRow = sheet.getLastRow();
                                if (lastRow < 2) return [];
                                    
                                        const lastCol = sheet.getLastColumn();
                                            let rangeString = "";
                                                let helperColIndex;

                                                    if (searchType === "업무 검색") {
                                                              if (lastCol < 16) return { error: "'업무_데이터' 시트는 최소 P열(16열)까지 필요합니다." };
                                                                    rangeString = "A2:P" + lastRow;
                                                                          helperColIndex = 15;
                                                    } else { 
                                                              if (lastCol < 9) return { error: "'이벤트_데이터' 시트는 최소 I열(9열)까지 필요합니다." };
                                                                    rangeString = "A2:I" + lastRow;
                                                                          helperColIndex = 8;
                                                    }
                                                        
                                                            const dataValues = sheet.getRange(rangeString).getValues();
                                                                const richTextValues = sheet.getRange(rangeString).getRichTextValues();
                                                                    const TIME_ZONE = "Asia/Seoul";
                                                                        const results = [];
                                                                            if (!searchTerm || searchTerm.trim() === "") return [];
                                                                                const keywords = searchTerm.split(',').map(kw => kw.trim().replace(/\s/g, '')).filter(kw => kw);
                                                                                    
                                                                                        for (let i = 0; i < dataValues.length; i++) {
                                                                                                  let rowValues = dataValues[i];
                                                                                                        let richTextRow = richTextValues[i];
                                                                                                              
                                                                                                                    let searchableText = '';
                                                                                                                          if (searchType === "업무 검색") {
                                                                                                                                    if (searchField === '유형') {
                                                                                                                                                  searchableText = rowValues[3];
                                                                                                                                    } else if (searchField === '상세내용') {
                                                                                                                                                  searchableText = rowValues[4];
                                                                                                                                    } else {
                                                                                                                                                  searchableText = rowValues[helperColIndex];
                                                                                                                                    }
                                                                                                                          } else {
                                                                                                                                    searchableText = rowValues[helperColIndex];
                                                                                                                          }
                                                                                                                                
                                                                                                                                      if (searchableText && keywords.some(kw => searchableText.toString().toLowerCase().includes(kw.toLowerCase()))) {
                                                                                                                                                let resultRow = [];
                                                                                                                                                        let originalDate;

                                                                                                                                                                if (searchType === "업무 검색") {
                                                                                                                                                                              const desiredIndices = [0, 1, 2, 3, 4, 14];
                                                                                                                                                                                        originalDate = new Date(rowValues[0]);
                                                                                                                                                                                                  for (const index of desiredIndices) {
                                                                                                                                                                                                                let textValue = rowValues[index];
                                                                                                                                                                                                                            if (index === 0 && textValue) textValue = Utilities.formatDate(new Date(textValue), TIME_ZONE, "yyyy.MM.dd");
                                                                                                                                                                                                                                        if (index === 1 && textValue) textValue = Utilities.formatDate(new Date(textValue), TIME_ZONE, "HH:mm");
                                                                                                                                                                                                                                                    resultRow.push({ text: textValue, url: richTextRow[index].getLinkUrl() });
                                                                                                                                                                                                  }
                                                                                                                                                                } else { // 이벤트 검색
                                                                                                                                                                          originalDate = new Date(rowValues[1]);
                                                                                                                                                                                    for (let k = 0; k < 8; k++) {
                                                                                                                                                                                                    let textValue = rowValues[k];
                                                                                                                                                                                                                const dateIndices = [1, 2, 4];
                                                                                                                                                                                                                            if (dateIndices.includes(k) && textValue) {
                                                                                                                                                                                                                                              textValue = Utilities.formatDate(new Date(textValue), TIME_ZONE, "yyyy.MM.dd");
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                        resultRow.push({ text: textValue, url: richTextRow[k].getLinkUrl() });
                                                                                                                                                                                    }
                                                                                                                                                                }

                                                                                                                                                                        // 안정성 강화: 날짜 값이 유효한 경우에만 정렬용 데이터로 추가
                                                                                                                                                                                if (originalDate && !isNaN(originalDate.getTime())) {
                                                                                                                                                                                              results.push({ sortDate: originalDate, data: resultRow });
                                                                                                                                                                                }
                                                                                                                                      }
                                                                                        }

                                                                                            results.sort((a, b) => b.sortDate - a.sortDate);
                                                                                                return results.map(item => item.data);

      } catch (e) {
            return { error: e.toString() };
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
                                                    }
      }
}