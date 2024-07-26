package com.javaex.book;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class BookSelect {

	public static void main(String[] args) {
		List<BookVo> bList = new ArrayList<BookVo>();
		// 0. import java.sql.*;
		Connection conn = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;

		try {
			// 1. JDBC 드라이버 (Oracle) 로딩
			Class.forName("com.mysql.cj.jdbc.Driver");
			// 2. Connection 얻어오기
			String url = "jdbc:mysql://localhost:3306/book_db";
			conn = DriverManager.getConnection(url, "book", "1234");
			// 3. SQL문 준비 / 바인딩 / 실행
			String qeury = "";
			qeury += " select book_id ";
			qeury += " 		,title ";
			qeury += "       ,pubs ";
			qeury += " 		,pub_date ";
			qeury += " 		,author_id ";
			qeury += "from book ";

			pstmt = conn.prepareStatement(qeury);

			rs = pstmt.executeQuery();

			while (rs.next()) {
				int bId = rs.getInt("book_id");
				String title = rs.getString("title");
				String pubs = rs.getString("pubs");
				String pdate = rs.getString("pub_date");
				int aId = rs.getInt("author_id");

				BookVo bookVo = new BookVo(bId, title, pubs, pdate, aId);
				bList.add(bookVo);
			}

			// 4.결과처리

		} catch (ClassNotFoundException e) {
			System.out.println("error: 드라이버 로딩 실패 - " + e);
		} catch (SQLException e) {
			System.out.println("error:" + e);
		} finally {

			// 5. 자원정리
			try {
				if (rs != null) {
					rs.close();
				}
				if (pstmt != null) {
					pstmt.close();
				}
				if (conn != null) {
					conn.close();
				}
			} catch (SQLException e) {
				System.out.println("error:" + e);
			}

		}
		for (BookVo Vo : bList) {
			System.out.print(Vo.getBook_id() + "\t");
			System.out.print(Vo.getTitle() + "\t");
			System.out.print(Vo.getPubs() + "\t");
			System.out.print(Vo.getPub_date() + "\t");
			System.out.println(Vo.getAuthor_id());

		}

	}
}
