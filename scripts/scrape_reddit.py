import json
import os
from typing import Any, Dict, List

import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
}
REDDIT_BASE = "https://hn.algolia.com/api/v1/search"
TWITTER_SEARCH = "https://hn.algolia.com/api/v1/search_by_date"


def _fetch_hn_hits(query: str, limit: int = 10, *, include_date: bool = False) -> List[Dict[str, Any]]:
    url = TWITTER_SEARCH if include_date else REDDIT_BASE
    params = {
        "query": query,
        "tags": "story",
        "hitsPerPage": limit,
    }

    try:
        response = requests.get(url, params=params, headers=HEADERS, timeout=20)
        response.raise_for_status()
        payload = response.json()
    except (requests.RequestException, ValueError):
        return []

    hits = payload.get("hits", [])
    posts: List[Dict[str, Any]] = []

    for item in hits[:limit]:
        title = item.get("title") or item.get("story_title") or item.get("story_text") or ""
        body = item.get("story_text") or item.get("comment_text") or item.get("title") or ""
        if not title and not body:
            continue

        posts.append(
            {
                "title": (title or body)[:180],
                "score": item.get("points"),
                "url": item.get("url") or item.get("story_url") or "",
                "selftext": body[:600],
                "source": "hn",
            }
        )

    return posts


def fetch_reddit_posts(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    return _fetch_hn_hits(query, limit)


def fetch_twitter_posts(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    return _fetch_hn_hits(f"{query} twitter", limit, include_date=True)


def main() -> None:
    query = os.getenv("PAINPOINT_QUERY", "customer support pain")
    reddit_posts = fetch_reddit_posts(query)
    twitter_posts = fetch_twitter_posts(query)

    result = {
        "query": query,
        "reddit": reddit_posts,
        "twitter": twitter_posts,
    }

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
