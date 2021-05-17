export async function fetchNews(data) {
    return await fetch(`https://newsapi.org/v2/everything?apiKey=0b36a18f9583428faa2b6a0cc68e7216&page=${data.page}&pageSize=${data.pageSize}&q=${data.query || null}&sortBy=publishedAt`)
}
