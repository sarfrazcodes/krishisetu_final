import os

search_text = "https://krishisetu-hhef.onrender.com"
replace_text = "http://localhost:8000"

frontend_dir = r"c:\Users\Sarfraz\krishisetu\frontend"

for root, dirs, files in os.walk(frontend_dir):
    for file in files:
        if file.endswith((".tsx", ".ts", ".js")):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            if search_text in content:
                new_content = content.replace(search_text, replace_text)
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Replaced in {filepath}")
