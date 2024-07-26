package com.javaex.author;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class AuthorSelect {

	public static void main(String[] args) {

		List<AuthorVo> aList = new ArrayList<AuthorVo>();

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
			String query = "";
			query += " select author_id ";
			query += "       ,author_name ";
			query += "       ,author_desc ";
			query += " from author ";

			pstmt = conn.prepareStatement(query);

			rs = pstmt.executeQuery();
			while (rs.next()) {
				int id = rs.getInt(1);
				String name = rs.getString(2);
				String desc = rs.getString(3);
				AuthorVo authorVo = new AuthorVo(id, name, desc);

				aList.add(authorVo);
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
		System.out.println(aList.get(4).getAuthor_name());

		for (int i = 0; i < aList.size(); i++) {
			System.out.print(aList.get(i).getAuthor_id() + "\t");
			System.out.print(aList.get(i).getAuthor_name() + "\t");
			System.out.println(aList.get(i).getAuthor_desc());

			System.out.println("----------------------------");

		for (AuthorVo vo : aList) {
			System.out.print(vo.getAuthor_id() + "\t");
			System.out.print(vo.getAuthor_name() + "\t");
			System.out.println(vo.getAuthor_desc());

			}
		}
	}
}
