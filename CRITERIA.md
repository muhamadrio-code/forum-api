## Table of contents

- [Table of contents](#table-of-contents)
    - [Kriteria 1: Menambahkan Thread](#kriteria-1-menambahkan-thread)
    - [Kriteria 2: Menambahkan Komentar pada Thread](#kriteria-2-menambahkan-komentar-pada-thread)
    - [Kriteria 3: Menghapus Komentar pada Thread](#kriteria-3-menghapus-komentar-pada-thread)
    - [Kriteria 4: Melihat Detail Thread](#kriteria-4-melihat-detail-thread)
    - [Kriteria 5: Menerapkan Automation Testing](#kriteria-5-menerapkan-automation-testing)
    - [Kriteria 6: Menerapkan Clean Architecture](#kriteria-6-menerapkan-clean-architecture)

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
    - Kembalikan dengan status code <b>400</b>
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
- Menambahkan <b>komentar</b> pada thread merupakan resource yang dibatasi <b>(restrict)</b>. Untuk mengaksesnya membutuhkan access token guna mengetahui siapa yang membuat komentar.
- Jika thread yang diberi komentar tidak ada atau tidak valid, maka:
  - Kembalikan dengan status code <b>404</b>
  - Berikan body response: 
    ```yaml
    {
      "status": “fail”
      "message": // Pesan apapun selama tidak kosong.
    }
    ```
- Jika properti body request tidak lengkap atau tidak sesuai, maka:
  - Kembalikan dengan status code <b>400</b>
  - Berikan body response:
    ```yaml
    {
      "status": “fail”
      "message": // Pesan apapun selama tidak kosong.
    }
    ```

## Kriteria 3: Menghapus Komentar pada Thread
#### Request:
 - method: <b>DELETE</b>
 - path: <b>/threads/{threadId}/comments/{commentId}</b>
    
#### Response:
  - status code: <b>200</b>
  - body:
    ```yaml
    {
        "content": string
    }
    ```

#### Ketentuan:
- Menghapus <b>komentar</b> pada thread merupakan resource yang dibatasi (restrict). Untuk mengaksesnya membutuhkan <i><b>access token</b></i> guna mengetahui siapa yang menghapus komentar.
- <b>Hanya pemilik komentar yang dapat menghapus komentar.</b> Bila bukan pemilik komentar, maka:
  - Kembalikan dengan status code <b>403</b>
  - Berikan body response: 
    ```yaml
    {
      "status": “fail”
      "message": // Pesan apapun selama tidak kosong.
    }
    ```
- Jika <b>thread</b> atau komentar yang hendak dihapus tidak ada atau tidak valid, maka:
  - Kembalikan dengan status code <b>404</b>
  - Berikan body response:
    ```yaml
    {
      "status": “fail”
      "message": // Pesan apapun selama tidak kosong.
    }
    ```
- Komentar dihapus secara <i>[soft delete](https://en.wiktionary.org/wiki/soft_deletion)</i>, alias tidak benar-benar dihapus dari <i>database</i>. Anda bisa membuat dan memanfaatkan kolom seperti `is_delete` sebagai indikator apakah komentar dihapus atau tidak.

## Kriteria 4: Melihat Detail Thread
#### Request:
 - method: <b>GET</b>
 - path: <b>/threads/{threadId}</b>
    
#### Response:
  - status code: <b>200</b>
  - body:
    ```yaml
    {
      "status": "success",
      "data": {
        "thread": {
            "id": "thread-h_2FkLZhtgBKY2kh4CC02",
            "title": "sebuah thread",
            "body": "sebuah body thread",
            "date": "2021-08-08T07:19:09.775Z",
            "username": "dicoding",
            "comments": [
              {
                  "id": "comment-_pby2_tmXV6bcvcdev8xk",
                  "username": "johndoe",
                  "date": "2021-08-08T07:22:33.555Z",
                  "content": "sebuah comment"
              },
              {
                  "id": "comment-yksuCoxM2s4MMrZJO-qVD",
                  "username": "dicoding",
                  "date": "2021-08-08T07:26:21.338Z",
                  "content": "**komentar telah dihapus**"
              }
            ]
          }
      }
    }
    ```

#### Ketentuan:
- Mendapatkan <b>detail thread</b> merupakan resource terbuka. Sehingga tidak perlu melampirkan <i>access token.</i>
- Jika thread yang diakses tidak ada atau tidak valid, maka:
  - Kembalikan dengan status code <b>404</b>
  - Berikan body response: 
    ```yaml
    {
      "status": “fail”
      "message": // Pesan apapun selama tidak kosong.
    }
    ```
- Wajib menampilkan seluruh komentar yang terdapat pada thread tersebut sesuai dengan contoh di atas.
- Komentar yang dihapus ditampilkan dengan konten **komentar telah dihapus**.
- Komentar diurutkan secara ascending (dari kecil ke besar) berdasarkan waktu berkomentar.

## Kriteria 5: Menerapkan Automation Testing
Proyek Forum API wajib menerapkan automation testing dengan kriteria berikut:
  - <b>Unit Testing:</b>
    - Wajib menerapkan Unit Testing pada bisnis logika yang ada. Baik di Entities ataupun di Use Case.
  - <b>Integration Test:</b>
    - Wajib menerapkan Integration Test dalam menguji interaksi database dengan Repository.
 
## Kriteria 6: Menerapkan Clean Architecture
Proyek Forum API wajib menerapkan Clean Architecture. Di mana source code terdiri dari 4 layer yaitu:

  - <b>Entities (jika dibutuhkan)</b>
    - Tempat penyimpanan data entitas bisnis utama. Jika suatu bisnis butuh mengelola struktur data yang kompleks, maka buatlah entities.
  - <b>Use Case:</b>
    - Di gunakan sebagai tempat menuliskannya flow atau alur bisnis logika.
  - <b>Interface Adapter (Repository dan Handler)</b>
    - Mediator atau penghubung antara layer framework dengan layer use case.
  - <b>Frameworks (Database dan HTTP server)</b>
    - Level paling luar merupakan bagian yang berhubungan dengan framework.