import os
from gui import App
from dotenv import load_dotenv

if __name__ == "__main__":
    load_dotenv()
    
    # Criar pasta de logs se necessário
    if not os.path.exists("logs"):
        os.makedirs("logs")
        
    app = App()
    app.mainloop()
