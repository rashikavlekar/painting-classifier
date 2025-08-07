from icrawler.builtin import BingImageCrawler

search_terms = [
    "art gallery interior", 
    "living room with painting", 
    "person standing next to painting", 
    "museum exhibition wall", 
    "home wall art decor", 
    "hotel lobby with painting"
]

save_dir = "./painting_dataset3/images"

crawler = BingImageCrawler(storage={"root_dir": save_dir})

for term in search_terms:
    crawler.crawl(keyword=term, max_num=200)
