# import os
# from flask import Flask, render_template, request, redirect, url_for, session
# from flask_socketio import SocketIO
# from alpaca_trade_api import REST
# from alpaca_trade_api.stream import Stream
# import yfinance as yf
# from datetime import datetime, time
# import pytz
# import sqlite3
# import threading
# from datetime import time
# import time as time_module

# from dotenv import load_dotenv
# load_dotenv()

# app = Flask(__name__)
# app.secret_key = 'your_secret_key_here'
# socketio = SocketIO(app)

# ALPACA_API_KEY = os.getenv('APCA_API_KEY_ID')
# ALPACA_SECRET_KEY = os.getenv('APCA_API_SECRET_KEY')
# paper = True
# BASE_URL = 'https://paper-api.alpaca.markets'

# alpaca = REST(ALPACA_API_KEY, ALPACA_SECRET_KEY, base_url=BASE_URL)

# def test_alpaca_connection():
#     try:
#         account = alpaca.get_account()
#         print("Alpaca connection successful!")
#         print(f"Account Status: {account.status}")
#     except Exception as e:
#         print(f"Failed to connect to Alpaca: {e}")

# # Call the test function
# test_alpaca_connection()
# # Database setup
# DATABASE = 'trading_app.db'

# def init_db():
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         cursor.execute('''
#             CREATE TABLE IF NOT EXISTS users (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 username TEXT UNIQUE NOT NULL,
#                 password TEXT NOT NULL
#             )
#         ''')
#         cursor.execute('''
#             CREATE TABLE IF NOT EXISTS trades (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 user_id INTEGER NOT NULL,
#                 market TEXT NOT NULL,
#                 symbol TEXT NOT NULL,
#                 side TEXT NOT NULL,
#                 quantity INTEGER NOT NULL,
#                 price REAL,
#                 order_type TEXT NOT NULL,
#                 limit_price REAL,
#                 stop_price REAL,
#                 timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
#                 FOREIGN KEY (user_id) REFERENCES users (id)
#             )
#         ''')
#         conn.commit()

# init_db()

# # Market hours (for US, Indian, Forex, and Crypto markets)
# MARKET_HOURS = {
#     'US': {'open': time(9, 30), 'close': time(16, 0)},  # 9:30 AM - 4:00 PM EST
#     'INDIA': {'open': time(9, 15), 'close': time(15, 30)},  # 9:15 AM - 3:30 PM IST
#     'FOREX': {'open': time(0, 0), 'close': time(23, 59)},  # 24/5 (closed weekends)
#     'CRYPTO': {'open': time(0, 0), 'close': time(23, 59)}  # 24/7
# }

# # Supported markets and symbols
# MARKETS = {
#     'US': ['AAPL', 'TSLA', 'GOOGL', 'AMZN'],
#     'INDIA': ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS'],
#     'FOREX': ['EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'AUDUSD=X'],
#     'CRYPTO': ['BTC-USD', 'ETH-USD', 'ADA-USD', 'DOGE-USD']
# }

# # Track active symbols for real-time updates
# active_symbols = set()
# active_symbols_lock = threading.Lock()

# # Alpaca WebSocket for US markets
# alpaca_stream = Stream(ALPACA_API_KEY, ALPACA_SECRET_KEY, base_url=BASE_URL, data_feed='iex')

# # Function to handle Alpaca WebSocket updates
# async def handle_alpaca_trade(data):
#     symbol = data.symbol
#     price = data.price
#     with active_symbols_lock:
#         if symbol in active_symbols:
#             socketio.emit('price_update', {symbol: price})

# # Start Alpaca WebSocket
# def start_alpaca_stream():
#     alpaca_stream.subscribe_trades(handle_alpaca_trade, '*')
#     alpaca_stream.run()

# # Poll yfinance for non-US markets
# def poll_yfinance():
#     while True:
#         with active_symbols_lock:
#             symbols = list(active_symbols)
#         prices = {}
#         for symbol in symbols:
#             if not symbol.endswith('.NS') and not symbol.endswith('=X') and not symbol.endswith('-USD'):
#                 continue  # Skip non-yfinance symbols
#             ticker = yf.Ticker(symbol)
#             data = ticker.history(period="1d")
#             if not data.empty:
#                 prices[symbol] = data['Close'].iloc[-1]
#         if prices:
#             socketio.emit('price_update', prices)
#         time.sleep(1)  # Poll every 1 second

# # Start WebSocket and polling in background threads
# threading.Thread(target=start_alpaca_stream, daemon=True).start()
# threading.Thread(target=poll_yfinance, daemon=True).start()

# @app.route('/')
# def home():
#     if 'username' not in session:
#         return redirect(url_for('login'))
#     return redirect(url_for('dashboard'))

# @app.route('/register', methods=['GET', 'POST'])
# def register():
#     if request.method == 'POST':
#         username = request.form['username']
#         password = request.form['password']
#         with sqlite3.connect(DATABASE) as conn:
#             cursor = conn.cursor()
#             try:
#                 cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
#                 conn.commit()
#                 return redirect(url_for('login'))
#             except sqlite3.IntegrityError:
#                 return "Username already exists. Please choose another."
#     return render_template('register.html')

# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         username = request.form['username']
#         password = request.form['password']
#         with sqlite3.connect(DATABASE) as conn:
#             cursor = conn.cursor()
#             cursor.execute('SELECT id, password FROM users WHERE username = ?', (username,))
#             user = cursor.fetchone()
#             if user and user[1] == password:
#                 session['user_id'] = user[0]
#                 session['username'] = username
#                 return redirect(url_for('dashboard'))
#         return "Invalid credentials"
#     return render_template('login.html')

# @app.route('/dashboard')
# def dashboard():
#     if 'user_id' not in session:
#         return redirect(url_for('login'))
    
#     # Get portfolio data (for US markets only, since Alpaca doesn't support other markets)
#     portfolio = alpaca.list_positions()
#     cash = float(alpaca.get_account().cash)
    
#     # Get trade history
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         cursor.execute('''
#             SELECT market, symbol, side, quantity, price, order_type, limit_price, stop_price, timestamp
#             FROM trades
#             WHERE user_id = ?
#             ORDER BY timestamp DESC
#         ''', (session['user_id'],))
#         trades = cursor.fetchall()
    
#     return render_template('dashboard.html', 
#                          portfolio=portfolio,
#                          cash=cash,
#                          markets=MARKETS,
#                          trades=trades)

# @app.route('/place_order', methods=['POST'])
# def place_order():
#     if 'user_id' not in session:
#         return redirect(url_for('login'))
    
#     market = request.form['market']
#     symbol = request.form['symbol'].upper()
#     quantity = int(request.form['quantity'])
#     side = request.form['side'].lower()
#     order_type = request.form['order_type']
#     limit_price = float(request.form['limit_price']) if request.form['limit_price'] else None
#     stop_price = float(request.form['stop_price']) if request.form['stop_price'] else None
    
#     # Check if market is open
#     if not is_market_open(market):
#         return f"{market} market is currently closed. Try again during trading hours."
    
#     # Get current price
#     price = get_current_price(symbol)
    
#     # Place order
#     if market == 'US':
#         try:
#             if order_type == 'market':
#                 order = alpaca.submit_order(
#                     symbol=symbol,
#                     qty=quantity,
#                     side=side,
#                     type='market',
#                     time_in_force='gtc'
#                 )
#             elif order_type == 'limit':
#                 order = alpaca.submit_order(
#                     symbol=symbol,
#                     qty=quantity,
#                     side=side,
#                     type='limit',
#                     time_in_force='gtc',
#                     limit_price=limit_price
#                 )
#             elif order_type == 'stop':
#                 order = alpaca.submit_order(
#                     symbol=symbol,
#                     qty=quantity,
#                     side=side,
#                     type='stop',
#                     time_in_force='gtc',
#                     stop_price=stop_price
#                 )
#             elif order_type == 'stop_limit':
#                 order = alpaca.submit_order(
#                     symbol=symbol,
#                     qty=quantity,
#                     side=side,
#                     type='stop_limit',
#                     time_in_force='gtc',
#                     stop_price=stop_price,
#                     limit_price=limit_price
#                 )
#             save_trade(session['user_id'], market, symbol, side, quantity, price, order_type, limit_price, stop_price)
#             return f"Order placed successfully: {order.side} {order.qty} shares of {order.symbol} at ${price:.2f}"
#         except Exception as e:
#             return f"Order failed: {str(e)}"
#     else:
#         # Simulate order placement for non-US markets
#         save_trade(session['user_id'], market, symbol, side, quantity, price, order_type, limit_price, stop_price)
#         return f"Simulated order: {side} {quantity} shares of {symbol} at ${price:.2f}"

# def is_market_open(market):
#     now = datetime.now(pytz.utc)
#     if market == 'US':
#         est = pytz.timezone('US/Eastern')
#         now_est = now.astimezone(est).time()
#         return MARKET_HOURS['US']['open'] <= now_est <= MARKET_HOURS['US']['close']
#     elif market == 'INDIA':
#         ist = pytz.timezone('Asia/Kolkata')
#         now_ist = now.astimezone(ist).time()
#         return MARKET_HOURS['INDIA']['open'] <= now_ist <= MARKET_HOURS['INDIA']['close']
#     elif market in ['FOREX', 'CRYPTO']:
#         return True  # Forex and Crypto are always open
#     return False

# def get_current_price(symbol):
#     ticker = yf.Ticker(symbol)
#     data = ticker.history(period='1d')
#     return data['Close'].iloc[-1]

# def save_trade(user_id, market, symbol, side, quantity, price, order_type, limit_price=None, stop_price=None):
#     with sqlite3.connect(DATABASE) as conn:
#         cursor = conn.cursor()
#         cursor.execute('''
#             INSERT INTO trades (user_id, market, symbol, side, quantity, price, order_type, limit_price, stop_price)
#             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
#         ''', (user_id, market, symbol, side, quantity, price, order_type, limit_price, stop_price))
#         conn.commit()

# # WebSocket for real-time price updates
# @socketio.on('connect')
# def handle_connect():
#     with active_symbols_lock:
#         for symbol in active_symbols:
#             socketio.emit('price_update', {symbol: get_current_price(symbol)})

# @socketio.on('subscribe_symbol')
# def handle_subscribe_symbol(symbol):
#     with active_symbols_lock:
#         active_symbols.add(symbol)
#     socketio.emit('price_update', {symbol: get_current_price(symbol)})

# if __name__ == '__main__':
#     socketio.run(app, debug=True)

import os
from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO
from alpaca_trade_api import REST
from alpaca_trade_api.stream import Stream
import yfinance as yf
from datetime import datetime, time
import pytz
import sqlite3
import threading
from datetime import time
import time as time_module
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "temporary_key")
socketio = SocketIO(app)

# Alpaca API credentials
ALPACA_API_KEY = os.getenv('APCA_API_KEY_ID')
ALPACA_SECRET_KEY = os.getenv('APCA_API_SECRET_KEY')
BASE_URL = 'https://paper-api.alpaca.markets'

alpaca = REST(ALPACA_API_KEY, ALPACA_SECRET_KEY, base_url=BASE_URL)

# Database setup
DATABASE = 'trading_app.db'

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS trades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                market TEXT NOT NULL,
                symbol TEXT NOT NULL,
                side TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL,
                order_type TEXT NOT NULL,
                limit_price REAL,
                stop_price REAL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        conn.commit()

init_db()

# Supported markets and symbols
MARKETS = {
    'US': ['AAPL', 'TSLA', 'GOOGL', 'AMZN'],
    'INDIA': ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS'],
    'FOREX': ['EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'AUDUSD=X'],
    'CRYPTO': ['BTC-USD', 'ETH-USD', 'ADA-USD', 'DOGE-USD']
}

def get_current_price(symbol):
    ticker = yf.Ticker(symbol)
    data = ticker.history(period='1d')
    return data['Close'].iloc[-1] if not data.empty else None

def save_trade(user_id, market, symbol, side, quantity, price, order_type, limit_price=None, stop_price=None):
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO trades (user_id, market, symbol, side, quantity, price, order_type, limit_price, stop_price)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, market, symbol, side, quantity, price, order_type, limit_price, stop_price))
        conn.commit()

@app.route('/')
def home():
    if 'username' not in session:
        return redirect(url_for('login'))
    return redirect(url_for('dashboard'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT id, password FROM users WHERE username = ?', (username,))
            user = cursor.fetchone()
            if user and user[1] == password:
                session['user_id'] = user[0]
                session['username'] = username
                return redirect(url_for('dashboard'))
        return "Invalid credentials"
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    portfolio = alpaca.list_positions()
    cash = float(alpaca.get_account().cash)
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT market, symbol, side, quantity, price, order_type, limit_price, stop_price, timestamp
            FROM trades
            WHERE user_id = ?
            ORDER BY timestamp DESC
        ''', (session['user_id'],))
        trades = cursor.fetchall()
    return render_template('dashboard.html', portfolio=portfolio, cash=cash, markets=MARKETS, trades=trades)

@app.route('/place_order', methods=['POST'])
def place_order():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    market = request.form['market']
    symbol = request.form['symbol'].upper()
    quantity = int(request.form['quantity'])
    side = request.form['side'].lower()
    order_type = request.form['order_type']
    limit_price = float(request.form['limit_price']) if request.form['limit_price'] else None
    stop_price = float(request.form['stop_price']) if request.form['stop_price'] else None
    
    price = get_current_price(symbol)
    
    if market == 'US':
        try:
            if order_type == 'market':
                order = alpaca.submit_order(symbol=symbol, qty=quantity, side=side, type='market', time_in_force='gtc')
            elif order_type == 'limit':
                order = alpaca.submit_order(symbol=symbol, qty=quantity, side=side, type='limit', time_in_force='gtc', limit_price=limit_price)
            elif order_type == 'stop':
                order = alpaca.submit_order(symbol=symbol, qty=quantity, side=side, type='stop', time_in_force='gtc', stop_price=stop_price)
            elif order_type == 'stop_limit':
                order = alpaca.submit_order(symbol=symbol, qty=quantity, side=side, type='stop_limit', time_in_force='gtc', stop_price=stop_price, limit_price=limit_price)
            
            save_trade(session['user_id'], market, symbol, side, quantity, price, order_type, limit_price, stop_price)
            return f"Order placed successfully: {order.side} {order.qty} shares of {order.symbol} at ${price:.2f}"
        except Exception as e:
            return f"Order failed: {str(e)}"
    else:
        save_trade(session['user_id'], market, symbol, side, quantity, price, order_type, limit_price, stop_price)
        return f"Simulated order: {side} {quantity} shares of {symbol} at ${price:.2f}"

if __name__ == '__main__':
    socketio.run(app, debug=True)
