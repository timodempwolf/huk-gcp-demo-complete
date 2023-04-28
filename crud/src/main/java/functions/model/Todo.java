package functions.model;

import java.util.Date;
import java.util.List;
import java.util.Objects;

import com.google.cloud.firestore.annotation.Exclude;

/** Represents a todo : id, text, author, creationDate, completed. */
public class Todo {

  @Exclude
  private String id;

  private String text;

  private String author;

  private Date creationDate;

  private Boolean completed;
  
  @Exclude
  private List<File> files;

  public Todo() {
    // Must have a public no-argument constructor
  }

  // Initialize all fields of a todo
  public Todo(
      String id,
      String text,
      String author,
      Date creationDate,
      Boolean completed,
      List<File> files) {
    this.id = id;
    this.text = text;
    this.author = author;
    this.creationDate = creationDate;
    this.completed = completed;
    this.files = files;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public String getAuthor() {
    return author;
  }

  public void setAuthor(String author) {
    this.author = author;
  }

  public Date getCreationDate() {
    return creationDate;
  }

  public void setCreationDate(Date creationDate) {
    this.creationDate = creationDate;
  }

  public Boolean getCompleted() {
    return completed;
  }

  public void setCompleted(Boolean completed) {
    this.completed = completed;
  }

  public List<File> getFiles() {
    return files;
  }

  public void setFiles(List<File> files) {
    this.files = files;
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    if (creationDate != null) {
      sb.append(creationDate);
      sb.append(",");
    }
    if (author != null) {
      sb.append(author);
      sb.append(",");
    }
    if (completed != null) {
      sb.append(completed);
    }
    // remove trailing comma
    if (sb.lastIndexOf(",") >= sb.length() - 1) {
      sb.deleteCharAt(sb.length() - 1);
    }
    sb.append(": ");
    if (text != null) {
      sb.append(text);
    }

    return sb.toString();
  }

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof Todo)) {
      return false;
    }
    Todo todo = (Todo) obj;
    return Objects.equals(id, todo.id)
        && Objects.equals(text, todo.text)
        && Objects.equals(author, todo.author)
        && Objects.equals(creationDate, todo.creationDate)
        && Objects.equals(completed, todo.completed);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, text, author, creationDate, completed);
  }
}
