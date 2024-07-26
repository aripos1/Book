package com.javaex.book;

public class BookVo {

	private int book_id;
	private String title;
	private String pubs;
	private String pub_date;
	private int author_id;
	private String author_name;
	private String author_desc;

	public BookVo() {
		super();
	}

	public BookVo(int book_id, String title, String pubs, String pub_date, int author_id) {
		super();
		this.book_id = book_id;
		this.title = title;
		this.pubs = pubs;
		this.pub_date = pub_date;
		this.author_id = author_id;

	}

	public BookVo(int book_id, String title, String pubs, String pub_date, int author_id, String author_name,
			String author_desc) {
		super();
		this.book_id = book_id;
		this.title = title;
		this.pubs = pubs;
		this.pub_date = pub_date;
		this.author_id = author_id;
		this.author_name = author_name;
		this.author_desc = author_desc;
	}

	public final int getBook_id() {
		return book_id;
	}

	public final void setBook_id(int book_id) {
		this.book_id = book_id;
	}

	public final String getTitle() {
		return title;
	}

	public final void setTitle(String title) {
		this.title = title;
	}

	public final String getPubs() {
		return pubs;
	}

	public final void setPubs(String pubs) {
		this.pubs = pubs;
	}

	public final String getPub_date() {
		return pub_date;
	}

	public final void setPub_date(String pub_date) {
		this.pub_date = pub_date;
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
		return "BookVo [book_id=" + book_id + ", title=" + title + ", pubs=" + pubs + ", pub_date=" + pub_date
				+ ", author_id=" + author_id + ", author_name=" + author_name + ", author_desc=" + author_desc + "]";
	}

}
