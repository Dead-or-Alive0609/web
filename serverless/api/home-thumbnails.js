// /api/home-thumbnails.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.KAKAO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Kakao API 키 누락' });
  }

  const books = [
    '불편한 편의점', '세이노의 가르침', '문과남자의 과학공부', '도둑맞은 집중력', '역행자',
    '아주 희미한 빛으로도', '호감가는 대화의 법칙', '도쿄 에일리언즈 1', '모순',
    '트렌드 코리아 2024', '하얼빈', '말의 품격'
  ];

  try {
    const results = [];

    for (const title of books) {
      const response = await fetch(`https://dapi.kakao.com/v3/search/book?query=${encodeURIComponent(title)}&size=1`, {
        headers: {
          Authorization: `KakaoAK ${apiKey}`
        }
      });

      const data = await response.json();
      const book = data.documents[0];
      results.push({
        title: book?.title || title,
        authors: book?.authors || [],
        isbn: book?.isbn || '',
        thumbnail: book?.thumbnail || ''
      });
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error('썸네일 로딩 실패:', err);
    return res.status(500).json({ error: '썸네일 로딩 실패' });
  }
}
