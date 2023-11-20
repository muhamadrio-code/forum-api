## Table of contents

- [Table of contents](#table-of-contents)
    - [Kriteria 1: Menambahkan Thread](#kriteria-1-menambahkan-thread)
    - [Kriteria 2: Menambahkan Komentar pada Thread](#kriteria-2-menambahkan-komentar-pada-thread)

## Kriteria 1: Menambahkan Thread
#### Request:
 - method: <b>POST</b>
 - path: <b>/threads</b>
 - body:
    ```yaml
    {
        "title": string,
        "body": string
    }
     ```
#### Response:
  - status code: <b>201</b>
  - body:
    ```yaml
    {
        "status": "success",
        "data": {
          "addedThread": {
            "id": "thread-h_W1Plfpj0TY7wyT2PUPX",
            "title": "sebuah thread",
            "owner": "user-DWrT3pXe1hccYkV1eIAxS"
          }
        }
    }
    ```
#### Ketentuan:
- Menambahkan <b>thread</b> merupakan resource yang dibatasi <b>(restrict)</b>. Untuk mengaksesnya membutuhkan <i><b>access token</b></i> guna mengetahui siapa yang membuat thread.
- Jika properti body request tidak lengkap atau tidak sesuai, maka:
    - Kembalikan dengan status code 400
    - Berikan body response: 
        ```yaml
         {
            "status": “fail”
            "message": // Pesan apapun selama tidak kosong.
         }
        ```
    
## Kriteria 2: Menambahkan Komentar pada Thread
#### Request:
 - method: <b>POST</b>
 - path: <b>/threads/{threadId}/comments</b>
 - body:
    ```yaml
    {
        "content": string
    }
    ```
#### Response:
  - status code: <b>201</b>
  - body:
    ```yaml
    {
      "status": "success",
      "data": {
        "addedComment": {
            "id": "comment-_pby2_tmXV6bcvcdev8xk",
            "content": "sebuah comment",
            "owner": "user-CrkY5iAgOdMqv36bIvys2"
        }
      }
    }
    ```
#### Ketentuan:
- Menambahkan komentar pada thread merupakan resource yang dibatasi (restrict). Untuk mengaksesnya membutuhkan access token guna mengetahui siapa yang membuat komentar.
- Jika thread yang diberi komentar tidak ada atau tidak valid, maka:
  - Kembalikan dengan status code 404
  - Berikan body response: 
    ```yaml
    {
      "status": “fail”
      "message": // Pesan apapun selama tidak kosong.
    }
    ```
- Jika properti body request tidak lengkap atau tidak sesuai, maka:
  - Kembalikan dengan status code 400; serta
  - Berikan body response:
        ```yaml
         {
            "status": “fail”
            "message": // Pesan apapun selama tidak kosong.
         }
        ```
