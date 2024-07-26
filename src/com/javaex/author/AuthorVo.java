package com.javaex.author;

public class AuthorVo {

	private int author_id;
	private String author_name;
	private String author_desc;

	public AuthorVo() {

	}

	public AuthorVo(int author_id, String author_name, String author_desc) {

		this.author_id = author_id;
		this.author_name = author_name;
		this.author_desc = author_desc;
	}

	public final int getAuthor_id() {
		return author_id;
	}

	public final void setAuthor_id(int author_id) {
		this.author_id = author_id;
	}

	public final String getAuthor_name() {
		return author_name;
	}

	public final void setAuthor_name(String author_name) {
		this.author_name = author_name;
	}

	public final String getAuthor_desc() {
		return author_desc;
	}

	public final void setAuthor_desc(String author_desc) {
		this.author_desc = author_desc;
	}

	@Override
	public String toString() {
		return "AuthorVo [author_id=" + author_id + ", author_name=" + author_name + ", author_desc=" + author_desc
				+ "]";
	}

}
