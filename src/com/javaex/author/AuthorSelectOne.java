package com.javaex.author;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class AuthorSelectOne {

	public static void main(String[] args) {
		AuthorVo authorVo = null;
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
			query += " select 	author_id ";
			query += "          ,author_name ";
			query += "          ,author_desc ";
			query += " from author ";
			query += " where author_id = ? ";

			pstmt = conn.prepareStatement(query);
			pstmt.setInt(1, 1);

			rs = pstmt.executeQuery();

			// 4.결과처리
			rs.next();
			int    id	= rs.getInt(1); //1은 author_id
			String name = rs.getString(2); //2는 author_name
			String desc = rs.getString(3); //3은 author_desc
			
			authorVo = new AuthorVo(id, name, desc);
			
		

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

		}System.out.println(authorVo);
	}
}
