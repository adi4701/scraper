import json
import os
import sys
from urllib.parse import quote

import requests


def main() -> None:
    url = os.environ.get("UPSTASH_REDIS_REST_URL")
    token = os.environ.get("UPSTASH_REDIS_REST_TOKEN")
    if not url or not token:
        raise RuntimeError("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required")

    payload = json.load(sys.stdin)
    posts = payload.get("posts", [])
    for post in posts:
        response = requests.post(
            f"{url}/lpush/raw_posts/{quote(json.dumps(post, separators=(',', ':')))}",
            headers={"Authorization": f"Bearer {token}"},
            timeout=20,
        )
        response.raise_for_status()

    print(json.dumps({"enqueued": len(posts)}))


if __name__ == "__main__":
    main()
