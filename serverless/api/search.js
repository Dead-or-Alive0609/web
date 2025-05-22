// api/search.js
export default async function handler(req, res) {
  const apiKey = process.env.KAKAO_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API 키가 없습니다." });
  }

  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).json({ error: "검색어가 필요합니다." });
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v3/search/book?query=${encodeURIComponent(keyword)}&size=10&sort=accuracy`,
      {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      }
    );
    const data = await response.json();
    res.status(200).json(data.documents || []);
  } catch (err) {
    console.error("search API 실패:", err);
    res.status(500).json({ error: "검색 실패" });
  }
}
