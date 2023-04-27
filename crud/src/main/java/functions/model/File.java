package functions.model;

import java.util.Objects;

/** Represents a file : bucket, filename. */
public class File {

  private String bucket;
  private String filename;
  private String url;

  public File() {
    // Must have a public no-argument constructor
  }

  // Initialize all fields of a todo
  public File(
      String bucket,
      String filename,
      String url) {
    this.bucket = bucket;
    this.filename = filename;
  }

  public String getBucket() {
    return bucket;
  }

  public void setBucket(String bucket) {
    this.bucket = bucket;
  }

  public String getFilename() {
    return filename;
  }

  public void setFilename(String filename) {
    this.filename = filename;
  }

  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append(bucket + "/" + filename);

    return sb.toString();
  }

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof File)) {
      return false;
    }
    File file = (File) obj;
    return Objects.equals(bucket, file.bucket)
        && Objects.equals(filename, file.filename)
        && Objects.equals(url, file.url);
  }

  @Override
  public int hashCode() {
    return Objects.hash(bucket, filename, url);
  }
}