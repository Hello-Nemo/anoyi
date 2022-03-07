from fastlab.models import Response
from fastlab.utils import TimeUtils
from api import app
import requests
from models import APIBody
from common import UA
from db import mongo


@app.get('/api/video/play')
def play_url(vid: str):
    """
    视频无水印播放地址
    """
    video_url = f'https://aweme.snssdk.com/aweme/v1/play/?video_id={vid}&ratio=720p&line=0'
    resp = requests.get(video_url, headers=UA.iphone, allow_redirects=False)
    if resp.status_code == 302:
        location = resp.headers['location']
        return Response(data=location.replace('http:', 'https:'))
    else:
        return Response(code=404, message='not found')


@app.get('/api/video/share/douyin/play')
def play_share(share_url: str):
    """
    视频分享播放地址
    """
    resp = requests.get(share_url, headers=UA.iphone, allow_redirects=False)
    if resp.status_code == 302:
        location = resp.headers['location']
        vid = location.split('?')[0].split('/')[-2]
        if vid:
            resp = requests.get(f'https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids={vid}', headers=UA.iphone).json()
            if resp.get('item_list'):
                return play_url(resp['item_list'][0]['video']['vid'])
    return Response(code=400, message='invlid share url')


@app.post('/api/video/fetch/favorite')
def fetch_favorite(body: APIBody):
    """
    收藏 -> 抖音 -> 我的喜欢
    """
    headers = {x.name: x.value for x in body.headers}
    resp = requests.get(body.url, headers=headers).json()
    if resp['status_code'] == 0:
            for item in resp['aweme_list']:
                item['collect_time'] = TimeUtils.timestamp()
                mongo['anoyi']['videos'].update({'aweme_id': item['aweme_id']}, item, upsert=True)
    return Response(data=(resp['status_code'] == 0))
