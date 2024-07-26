package com.javaex.book;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class BookSelectOne {

	public static void main(String[] args) {

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
			qeury += " 		,b.author_id ";
			qeury += "		,author_name ";
			qeury += "		,author_desc ";
			qeury += "from book b, author a ";
			qeury += "where b.author_id = a.author_id ";
			qeury += "and book_id = ? ";

			pstmt = conn.prepareStatement(qeury);
			pstmt.setInt(1, 5);
			// 4.결과처리

			rs = pstmt.executeQuery();

			rs.next();
			int bId = rs.getInt("book_id");
			String title = rs.getString("title");
			String pubs = rs.getString("pubs");
			String pdate = rs.getString("pub_date");
			int aId = rs.getInt("b.author_id");
			String name = rs.getString("author_name");
			String desc = rs.getString("author_desc");

			BookVo bookVo = new BookVo(bId, title, pubs, pdate, aId, name, desc);
			System.out.println(bookVo);

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

	}

}
