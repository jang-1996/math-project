import requests
from bs4 import BeautifulSoup

for page in range(1, 238):
    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get('http://scienceon.hani.co.kr/?mid=media&page='.format(page), headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')
    articles = soup.select('#content > div > div.article_list  li')
    # articles = soup.select('#content > div > div.article_list li')

    for article in articles:
        a_tag = article.select_one('a')
        if a_tag is not None:
            title = a_tag.text
            cata = article.select_one('span.category').text
            author = article.select_one('span.author').text
            date = article.select_one('span.date').text
            des = article.select_one('p.summary').text
            print(title, cata, author, date, des)