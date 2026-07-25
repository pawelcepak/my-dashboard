#!/usr/bin/env python3
import collections
import collections.abc
for _name in ("Sequence", "Mapping", "MutableMapping", "Iterable", "Callable"):
    if not hasattr(collections, _name):
        setattr(collections, _name, getattr(collections.abc, _name))

import sys
if sys.platform == "win32":
    import ctypes
    try:
        ctypes.windll.shcore.SetProcessDpiAwareness(2)
    except Exception:
        try:
            ctypes.windll.user32.SetProcessDPIAware()
        except Exception:
            pass

import tkinter as tk
from tkinter import ttk, messagebox
import json
import os
import subprocess
import threading
import time
import io
from PIL import Image, ImageGrab
import pyautogui
from pynput import keyboard

from pynput import mouse
from pynput.keyboard import Controller as KeyboardController

import sys
if sys.platform == "win32":
    import ctypes
    try:
        ctypes.windll.shcore.SetProcessDpiAwareness(2)  # PER_MONITOR_DPI_AWARE
    except Exception:
        try:
            ctypes.windll.user32.SetProcessDPIAware()
        except Exception:
            pass

# KOPSY
DATA_FILE = "buttons.json"
AUTOCLICKER_FILE = "autoclicker.json"
EMOJI_FILE = "emoji_positions.json"
DEFAULT_DATA = {
    "categories": []
}


def load_data():
    if not os.path.exists(DATA_FILE):
        save_data(DEFAULT_DATA)
        return DEFAULT_DATA
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, list):
        migrated = {"categories": [{"name": "Kopsy", "buttons": data}]}
        save_data(migrated)
        return migrated
    return data


def save_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# ============================================
# AUTOCLICKER – zapis/odczyt
# ============================================
def load_autoclicker():
    if not os.path.exists(AUTOCLICKER_FILE):
        return {}
    try:
        with open(AUTOCLICKER_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def save_autoclicker(data):
    with open(AUTOCLICKER_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# ============================================
# EMOJI – zapis/odczyt
# ============================================
def load_emoji():
    if not os.path.exists(EMOJI_FILE):
        return {}
    try:
        with open(EMOJI_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def save_emoji(data):
    with open(EMOJI_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)



COLORS = {
    "bg": "#f0f2f5",
    "panel": "#ffffff",
    "panel_shadow": "#e8ecf1",
    "accent": "#1c83d6",
    "accent2": "#00b894",
    "text": "#2d3436",
    "subtext": "#636e72",
    "btn_bg": "#dfe6e9",
    "btn_hover": "#d6275c",
    "btn_text": "#2d3436",
    "cat_header": "#ffffff",
    "danger": "#e17055",
    "success": "#00b894",
    "entry_bg": "#f8f9fa",
    "border": "#dfe6e9",
}
AUTOCLICKER_C = {
    "bg": "#f0f2f5",
    "panel": "#ffffff",
    "panel_shadow": "#e8ecf1",
    "accent": "#0984e3",
    "text": "#2d3436",
    "subtext": "#636e72",
    "entry": "#f8f9fa",
    "success": "#00b894",
    "danger": "#e17055",
    "border": "#dfe6e9",
}


# ============================================
# AUTOCLICKER helpers
# ============================================
def check_deps():
    """Sprawdza wymagane biblioteki Pythona (zamiast programów systemowych Linuksa)."""
    missing = []
    try:
        import pyautogui  # noqa
    except ImportError:
        missing.append("pyautogui  →  pip install pyautogui")
    try:
        from PIL import Image, ImageGrab  # noqa
    except ImportError:
        missing.append("Pillow  →  pip install Pillow")
    try:
        import pynput  # noqa
    except ImportError:
        missing.append("pynput  →  pip install pynput")
    return missing


def grab_region(x, y, w, h):
    """Zrzut ekranu z podanego obszaru, działa na Windows/macOS/Linux dzięki PIL.ImageGrab."""
    try:
        img = ImageGrab.grab(bbox=(x, y, x + w, y + h))
        return img.convert("RGB")
    except Exception:
        return None


def avg_color(img):
    s = img.resize((8, 8))
    px = list(s.getdata())
    n = len(px)
    return tuple(sum(p[i] for p in px) // n for i in range(3))


def color_distance(c1, c2):
    return sum(abs(a - b) for a, b in zip(c1, c2))


def click_at(x, y):
    pyautogui.moveTo(x, y)
    time.sleep(0.05)
    pyautogui.click()


def get_mouse_pos():
    pos = pyautogui.position()
    return pos[0], pos[1]


# ============================================
# EMOJI CLICKER helpers
# ============================================
EMOJI_POSITIONS = {
    "tab": None,
    "1": None,
    "2": None,
    "3": None,
    "4": None,
    "5": None,
    "6": None,
    "7": None,
    "8": None,
    "9": None
}
emoji_running = False
emoji_listener = None

# ============================================
# AUTO-KOPIUJ ZAZNACZENIE / WKLEJ SCROLL LOCK
# ============================================
_kb_controller = KeyboardController()
autocopy_running = False
autocopy_mouse_listener = None
autocopy_keyboard_listener = None
_autocopy_press_pos = None
_autocopy_drag_threshold = 4  # px – ile trzeba przeciągnąć, by uznać to za zaznaczanie


# ============================================
# GŁÓWNY PROGRAM - jedno okno, trzy sekcje
# ============================================
class MainApp:
    def __init__(self, root):
        self.root = root
        self.root.title("PANEL CHB")
        self.root.configure(bg=COLORS["bg"])
        screen_w = root.winfo_screenwidth()
        screen_h = root.winfo_screenheight()
        width = max(400, int(screen_w * 0.30))
        self.root.geometry(f"{width}x{screen_h}+0+0")
        self.data = load_data()
        # Główny kontener pionowy
        self.main_frame = tk.Frame(root, bg=COLORS["bg"])
        self.main_frame.pack(fill="both", expand=True)
        # Konfiguracja wag wierszy
        self.main_frame.grid_rowconfigure(0, weight=35)
        self.main_frame.grid_rowconfigure(1, weight=18)
        self.main_frame.grid_rowconfigure(2, weight=18)
        self.main_frame.grid_rowconfigure(3, weight=14)
        self.main_frame.grid_columnconfigure(0, weight=1)
        # Sekcja górna - przyciski
        self.frame_buttons = tk.Frame(self.main_frame, bg=COLORS["bg"])
        self.frame_buttons.grid(row=0, column=0, sticky="nsew")
        # Sekcja środkowa - autoclicker
        sep1 = tk.Frame(self.main_frame, bg=COLORS["border"], height=2)
        sep1.grid(row=1, column=0, sticky="ew")
        self.frame_ac = tk.Frame(self.main_frame, bg=AUTOCLICKER_C["bg"])
        self.frame_ac.grid(row=1, column=0, sticky="nsew")
        # Sekcja dolna - emoji
        sep2 = tk.Frame(self.main_frame, bg=COLORS["border"], height=2)
        sep2.grid(row=2, column=0, sticky="ew")
        self.frame_emoji = tk.Frame(self.main_frame, bg=COLORS["bg"])
        self.frame_emoji.grid(row=2, column=0, sticky="nsew")
        # Sekcja dolna - autokopiowanie / wklejanie Scroll Lock
        sep3 = tk.Frame(self.main_frame, bg=COLORS["border"], height=2)
        sep3.grid(row=3, column=0, sticky="ew")
        self.frame_autocopy = tk.Frame(self.main_frame, bg=COLORS["bg"])
        self.frame_autocopy.grid(row=3, column=0, sticky="nsew")
        # Inicjalizacja sekcji
        self.init_kopsy()
        self.init_autoclicker()
        self.init_emoji()
        self.init_autocopy()

    # ==========================================
    # KOPSY
    # ==========================================
    def init_kopsy(self):
        # Panel z cieniem
        panel = tk.Frame(self.frame_buttons, bg=COLORS["panel"], relief="flat", bd=0)
        panel.pack(fill="both", expand=True, padx=8, pady=8)

        # Dodajemy delikatny cień
        shadow = tk.Frame(self.frame_buttons, bg=COLORS["panel_shadow"])
        shadow.place(relx=0.5, rely=0.5, anchor="center", relwidth=0.98, relheight=0.98)
        shadow.lower()

        self.canvas = tk.Canvas(panel, bg=COLORS["panel"], highlightthickness=0)
        self.scrollbar = ttk.Scrollbar(panel, orient="vertical", command=self.canvas.yview)
        self.canvas.configure(yscrollcommand=self.scrollbar.set)
        self.scrollbar.pack(side="right", fill="y")
        self.canvas.pack(side="left", fill="both", expand=True)
        self.buttons_frame = tk.Frame(self.canvas, bg=COLORS["panel"])
        self.canvas_window = self.canvas.create_window((0, 0), window=self.buttons_frame, anchor="nw")
        self.buttons_frame.bind("<Configure>", self._on_frame_configure)
        self.canvas.bind("<Configure>", self._on_canvas_configure)
        self.canvas.bind_all("<MouseWheel>", self._on_mousewheel)
        self.canvas.bind_all("<Button-4>", self._on_mousewheel)
        self.canvas.bind_all("<Button-5>", self._on_mousewheel)
        self.build_buttons_tab()

    def _on_frame_configure(self, event=None):
        self.canvas.configure(scrollregion=self.canvas.bbox("all"))

    def _on_canvas_configure(self, event):
        self.canvas.itemconfig(self.canvas_window, width=event.width)

    def _on_mousewheel(self, event):
        if event.num == 4:
            self.canvas.yview_scroll(-1, "units")
        elif event.num == 5:
            self.canvas.yview_scroll(1, "units")
        else:
            # Na Windows delta jest zwykle wielokrotnością 120
            self.canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")

    def copy_primary(self, text):
        """Kopiuje tekst do schowka systemowego (działa identycznie na Windows i Linux)."""
        try:
            self.root.clipboard_clear()
            self.root.clipboard_append(text)
            self.root.update()  # wymagane, by schowek został zaktualizowany natychmiast
        except Exception as e:
            messagebox.showerror("Błąd", f"Nie udało się skopiować:\n{e}")

    def build_buttons_tab(self):
        for w in self.buttons_frame.winfo_children():
            w.destroy()
        columns = 3
        self.buttons_frame.grid_columnconfigure(0, weight=1)
        for cat_idx, category in enumerate(self.data["categories"]):
            grid = tk.Frame(self.buttons_frame, bg=COLORS["panel"])
            grid.grid(row=cat_idx * 2, column=0, sticky="ew", padx=4, pady=6)
            for c in range(columns):
                grid.grid_columnconfigure(c, weight=1)
            for i, item in enumerate(category["buttons"]):
                btn = tk.Button(
                    grid,
                    text=item["label"],
                    command=lambda t=item["text"]: self.copy_primary(t),
                    height=3,
                    wraplength=100,
                    bg=COLORS["btn_bg"],
                    fg=COLORS["btn_text"],
                    activebackground=COLORS["btn_hover"],
                    activeforeground="white",
                    relief="flat",
                    cursor="hand2",
                    font=("Segoe UI", 9),
                    bd=0
                )
                btn.grid(row=i // columns, column=i % columns,
                         sticky="nsew", padx=3, pady=3)
                btn.bind("<Enter>", lambda e, b=btn: b.config(bg=COLORS["btn_hover"], fg="white"))
                btn.bind("<Leave>", lambda e, b=btn: b.config(bg=COLORS["btn_bg"], fg=COLORS["btn_text"]))

    # ==========================================
    # AUTOCLICKER
    # ==========================================
    def init_autoclicker(self):
        self.ac_region = None
        self.ac_click_pos = None
        self.ac_idle_color = None
        self.ac_running = False
        self.ac_click_count = 0
        # Wczytaj zapisane dane
        saved = load_autoclicker()
        if saved.get("region"):
            self.ac_region = tuple(saved["region"])
        if saved.get("click_pos"):
            self.ac_click_pos = tuple(saved["click_pos"])
        if saved.get("idle_color"):
            self.ac_idle_color = tuple(saved["idle_color"])
        saved_tol = saved.get("tolerance", 75)
        # Panel z cieniem
        panel = tk.Frame(self.frame_ac, bg=AUTOCLICKER_C["panel"], relief="flat", bd=0)
        panel.pack(fill="both", expand=True, padx=8, pady=8)

        # Nagłówek
        hdr = tk.Frame(panel, bg=AUTOCLICKER_C["panel"])
        hdr.pack(fill="x", pady=(0, 6))
        tk.Label(hdr, text="⚡ AUTOCLICKER", bg=AUTOCLICKER_C["panel"],
                 fg=AUTOCLICKER_C["accent"],
                 font=("Segoe UI", 10, "bold")).pack(side="left", padx=8)
        # Przycisk Zapisz / Wczytaj / Reset
        btn_row = tk.Frame(panel, bg=AUTOCLICKER_C["panel"])
        btn_row.pack(fill="x", padx=6, pady=(0, 6))
        self._ac_btn(btn_row, "💾 Zapisz", self._ac_save, AUTOCLICKER_C["success"], 7).pack(side="left", padx=2)
        self._ac_btn(btn_row, "📂 Wczytaj", self._ac_load, AUTOCLICKER_C["accent"], 7).pack(side="left", padx=2)
        self._ac_btn(btn_row, "🔄 Reset", self._ac_reset, AUTOCLICKER_C["danger"], 7).pack(side="left", padx=2)
        self.ac_lbl_save_status = tk.Label(btn_row, text="", bg=AUTOCLICKER_C["panel"],
                                            fg=AUTOCLICKER_C["success"], font=("Segoe UI", 7))
        self.ac_lbl_save_status.pack(side="left", padx=4)
        inner = tk.Frame(panel, bg=AUTOCLICKER_C["panel"])
        inner.pack(fill="both", expand=True, padx=6, pady=3)
        # Wiersz 1: Obszar + Klik
        row1 = tk.Frame(inner, bg=AUTOCLICKER_C["panel"])
        row1.pack(fill="x", pady=2)
        tk.Label(row1, text="Obszar:", bg=AUTOCLICKER_C["panel"], fg=AUTOCLICKER_C["text"],
                 font=("Segoe UI", 8, "bold")).pack(side="left")
        region_text = f"{self.ac_region[2]}×{self.ac_region[3]}" if self.ac_region else "--"
        self.ac_lbl_region = tk.Label(row1, text=region_text,
                                       bg=AUTOCLICKER_C["entry"], fg=AUTOCLICKER_C["subtext"],
                                       font=("Segoe UI", 7), padx=6, pady=2, width=8,
                                       relief="solid", bd=1)
        self.ac_lbl_region.pack(side="left", padx=4)
        if self.ac_region:
            self.ac_lbl_region.config(fg=AUTOCLICKER_C["text"])
        self._ac_btn(row1, "Ustaw", self._ac_pick_region, AUTOCLICKER_C["accent"], 7).pack(side="left", padx=2)
        tk.Label(row1, text="  Klik:", bg=AUTOCLICKER_C["panel"], fg=AUTOCLICKER_C["text"],
                 font=("Segoe UI", 8, "bold")).pack(side="left")
        click_text = f"({self.ac_click_pos[0]},{self.ac_click_pos[1]})" if self.ac_click_pos else "--"
        self.ac_lbl_click_pos = tk.Label(row1, text=click_text,
                                          bg=AUTOCLICKER_C["entry"], fg=AUTOCLICKER_C["subtext"],
                                          font=("Segoe UI", 7), padx=6, pady=2, width=8,
                                          relief="solid", bd=1)
        self.ac_lbl_click_pos.pack(side="left", padx=4)
        if self.ac_click_pos:
            self.ac_lbl_click_pos.config(fg=AUTOCLICKER_C["text"])
        self._ac_btn(row1, "Ustaw", self._ac_pick_click_pos, AUTOCLICKER_C["accent"], 7).pack(side="left", padx=2)
        # Wiersz 2: Próbkuj + Próg
        row2 = tk.Frame(inner, bg=AUTOCLICKER_C["panel"])
        row2.pack(fill="x", pady=2)
        tk.Label(row2, text="Próbkuj:", bg=AUTOCLICKER_C["panel"], fg=AUTOCLICKER_C["text"],
                 font=("Segoe UI", 8, "bold")).pack(side="left")
        idle_hx = "#dfe6e9"
        idle_text = " ? "
        idle_rgb_text = "--"
        if self.ac_idle_color:
            idle_hx = "#{:02x}{:02x}{:02x}".format(*self.ac_idle_color)
            idle_text = idle_hx
            idle_rgb_text = str(self.ac_idle_color)
        self.ac_idle_preview = tk.Label(row2, text=idle_text, bg=idle_hx,
                                         fg=AUTOCLICKER_C["text"], font=("Segoe UI", 7, "bold"),
                                         padx=6, pady=2, width=5, relief="solid", bd=1)
        self.ac_idle_preview.pack(side="left", padx=2)
        self.ac_lbl_idle = tk.Label(row2, text=idle_rgb_text,
                                     bg=AUTOCLICKER_C["panel"], fg=AUTOCLICKER_C["subtext"],
                                     font=("Segoe UI", 7))
        self.ac_lbl_idle.pack(side="left", padx=2)
        self._ac_btn(row2, "Próbkuj", self._ac_sample_idle, AUTOCLICKER_C["accent"], 7).pack(side="left", padx=4)
        tk.Label(row2, text="Próg:", bg=AUTOCLICKER_C["panel"], fg=AUTOCLICKER_C["text"],
                 font=("Segoe UI", 8, "bold")).pack(side="left")
        self.ac_tol_var = tk.IntVar(value=saved_tol)
        scale = tk.Scale(row2, from_=10, to=150, orient="horizontal",
                          variable=self.ac_tol_var, bg=AUTOCLICKER_C["panel"],
                          troughcolor=AUTOCLICKER_C["entry"],
                          highlightthickness=0, bd=0, length=80,
                          font=("Segoe UI", 6))
        scale.pack(side="left", padx=2)
        # Wiersz 3: Live + Status + Sterowanie
        row3 = tk.Frame(inner, bg=AUTOCLICKER_C["panel"])
        row3.pack(fill="x", pady=2)
        tk.Label(row3, text="Live:", bg=AUTOCLICKER_C["panel"], fg=AUTOCLICKER_C["text"],
                 font=("Segoe UI", 8, "bold")).pack(side="left")
        self.ac_cur_preview = tk.Label(row3, text=" – ", bg="#dfe6e9",
                                        fg=AUTOCLICKER_C["text"], font=("Segoe UI", 7, "bold"),
                                        padx=6, pady=2, width=5, relief="solid", bd=1)
        self.ac_cur_preview.pack(side="left", padx=2)
        self.ac_lbl_cur = tk.Label(row3, text="--",
                                    bg=AUTOCLICKER_C["panel"], fg=AUTOCLICKER_C["subtext"],
                                    font=("Segoe UI", 6))
        self.ac_lbl_cur.pack(side="left", padx=2)
        self.ac_lbl_dist = tk.Label(row3, text="d:--",
                                     bg=AUTOCLICKER_C["panel"], fg=AUTOCLICKER_C["subtext"],
                                     font=("Segoe UI", 6))
        self.ac_lbl_dist.pack(side="left", padx=2)
        self.ac_lbl_status = tk.Label(row3, text="⏸ Stop",
                                       bg=AUTOCLICKER_C["entry"], fg=AUTOCLICKER_C["subtext"],
                                       font=("Segoe UI", 7, "bold"), padx=6, pady=2,
                                       relief="solid", bd=1)
        self.ac_lbl_status.pack(side="left", fill="x", expand=True, padx=4)
        self.ac_lbl_clicks = tk.Label(row3, text="0",
                                       bg=AUTOCLICKER_C["panel"], fg=AUTOCLICKER_C["subtext"],
                                       font=("Segoe UI", 8, "bold"))
        self.ac_lbl_clicks.pack(side="left", padx=2)
        self.ac_btn_start = self._ac_btn(row3, "▶", self._ac_start, AUTOCLICKER_C["success"], 8)
        self.ac_btn_start.pack(side="left", padx=2)
        self.ac_btn_stop = self._ac_btn(row3, "■", self._ac_stop, AUTOCLICKER_C["danger"], 8)
        self.ac_btn_stop.pack(side="left", padx=2)
        self.ac_btn_stop.config(state="disabled")
        missing = check_deps()
        if missing:
            messagebox.showwarning("Brakuje zależności",
                                    "\n".join(f"• {m}" for m in missing))

    def _ac_btn(self, parent, text, cmd, color, size=8):
        return tk.Button(parent, text=text, command=cmd,
                          bg=color, fg="white",
                          activebackground=color, activeforeground="white",
                          relief="flat", cursor="hand2",
                          font=("Segoe UI", size, "bold"), padx=8, pady=2)

    def _ac_save(self):
        data = {
            "region": list(self.ac_region) if self.ac_region else None,
            "click_pos": list(self.ac_click_pos) if self.ac_click_pos else None,
            "idle_color": list(self.ac_idle_color) if self.ac_idle_color else None,
            "tolerance": self.ac_tol_var.get(),
        }
        save_autoclicker(data)
        self.ac_lbl_save_status.config(text="✓ Zapisano", fg=AUTOCLICKER_C["success"])
        self.root.after(2500, lambda: self.ac_lbl_save_status.config(text=""))

    def _ac_load(self):
        saved = load_autoclicker()
        if not saved:
            self.ac_lbl_save_status.config(text="Brak zapisu", fg=AUTOCLICKER_C["danger"])
            self.root.after(2000, lambda: self.ac_lbl_save_status.config(text=""))
            return
        if saved.get("region"):
            self.ac_region = tuple(saved["region"])
            rw, rh = self.ac_region[2], self.ac_region[3]
            self.ac_lbl_region.config(text=f"{rw}×{rh}", fg=AUTOCLICKER_C["text"])
        if saved.get("click_pos"):
            self.ac_click_pos = tuple(saved["click_pos"])
            self.ac_lbl_click_pos.config(
                text=f"({self.ac_click_pos[0]},{self.ac_click_pos[1]})",
                fg=AUTOCLICKER_C["text"]
            )
        if saved.get("idle_color"):
            self.ac_idle_color = tuple(saved["idle_color"])
            hx = "#{:02x}{:02x}{:02x}".format(*self.ac_idle_color)
            self.ac_idle_preview.config(bg=hx, text=hx)
            self.ac_lbl_idle.config(text=str(self.ac_idle_color), fg=AUTOCLICKER_C["text"])
        if saved.get("tolerance") is not None:
            self.ac_tol_var.set(saved["tolerance"])
        self.ac_lbl_save_status.config(text="✓ Wczytano", fg=AUTOCLICKER_C["success"])
        self.root.after(2500, lambda: self.ac_lbl_save_status.config(text=""))

    def _ac_reset(self):
        self.ac_region = None
        self.ac_click_pos = None
        self.ac_idle_color = None
        self.ac_tol_var.set(75)
        self.ac_lbl_region.config(text="--", fg=AUTOCLICKER_C["subtext"])
        self.ac_lbl_click_pos.config(text="--", fg=AUTOCLICKER_C["subtext"])
        self.ac_idle_preview.config(bg="#dfe6e9", text=" ? ")
        self.ac_lbl_idle.config(text="--", fg=AUTOCLICKER_C["subtext"])
        self.ac_lbl_save_status.config(text="↺ Reset", fg=AUTOCLICKER_C["accent"])
        self.root.after(2000, lambda: self.ac_lbl_save_status.config(text=""))

    def _ac_pick_region(self):
        dlg = tk.Toplevel(self.root)
        dlg.title("Ustaw obszar")
        dlg.configure(bg=AUTOCLICKER_C["bg"])
        dlg.attributes("-topmost", True)
        dlg.resizable(False, False)
        dlg.geometry("320x160")
        self._ac_dlg_lbl = tk.Label(dlg,
                                     text="Przesuń mysz na LEWY GÓRNY róg\npola przycisku Wyślij i czekaj...",
                                     bg=AUTOCLICKER_C["bg"], fg=AUTOCLICKER_C["text"],
                                     font=("Segoe UI", 10), pady=10, padx=16, justify="center")
        self._ac_dlg_lbl.pack()
        self._ac_dlg_cnt = tk.Label(dlg, text="3", bg=AUTOCLICKER_C["bg"], fg=AUTOCLICKER_C["accent"],
                                     font=("Segoe UI", 32, "bold"))
        self._ac_dlg_cnt.pack()
        tk.Button(dlg, text="Anuluj", command=dlg.destroy,
                  bg=AUTOCLICKER_C["danger"], fg="white", relief="flat",
                  font=("Segoe UI", 8), padx=8, pady=3).pack(pady=6)
        points = []

        def tick(n, phase):
            if not dlg.winfo_exists():
                return
            self._ac_dlg_cnt.config(text=str(n))
            if n > 0:
                dlg.after(1000, tick, n - 1, phase)
                return
            x, y = get_mouse_pos()
            points.append((x, y))
            if phase == 1:
                self._ac_dlg_lbl.config(
                    text=f"Punkt 1: ({x},{y}) ✓\n\nTeraz przesuń na PRAWY DOLNY róg i czekaj...")
                dlg.after(400, tick, 3, 2)
            else:
                x1, y1 = points[0]
                x2, y2 = points[1]
                rx, ry = min(x1, x2), min(y1, y2)
                rw, rh = abs(x2 - x1), abs(y2 - y1)
                if rw < 5 or rh < 5:
                    self._ac_dlg_lbl.config(text="❌ Obszar za mały. Spróbuj ponownie.")
                    self._ac_dlg_cnt.config(text="")
                    dlg.after(2000, dlg.destroy)
                    return
                self.ac_region = (rx, ry, rw, rh)
                self.ac_lbl_region.config(text=f"{rw}×{rh}", fg=AUTOCLICKER_C["text"])
                self._ac_dlg_lbl.config(text=f"✓ Gotowe!\n{rw}×{rh}px w ({rx},{ry})")
                self._ac_dlg_cnt.config(text="✓", fg=AUTOCLICKER_C["success"])
                dlg.after(1500, dlg.destroy)

        dlg.after(300, tick, 3, 1)

    def _ac_pick_click_pos(self):
        dlg = tk.Toplevel(self.root)
        dlg.title("Miejsce kliknięcia")
        dlg.configure(bg=AUTOCLICKER_C["bg"])
        dlg.attributes("-topmost", True)
        dlg.resizable(False, False)
        dlg.geometry("300x140")
        lbl = tk.Label(dlg, text="Ustaw kursor",
                        bg=AUTOCLICKER_C["bg"], fg=AUTOCLICKER_C["text"],
                        font=("Segoe UI", 10), pady=10, padx=16, justify="center")
        lbl.pack()
        cnt = tk.Label(dlg, text="3", bg=AUTOCLICKER_C["bg"], fg=AUTOCLICKER_C["accent"],
                        font=("Segoe UI", 32, "bold"))
        cnt.pack()
        tk.Button(dlg, text="Anuluj", command=dlg.destroy,
                  bg=AUTOCLICKER_C["danger"], fg="white", relief="flat",
                  font=("Segoe UI", 8), padx=8, pady=3).pack(pady=4)

        def tick(n):
            if not dlg.winfo_exists():
                return
            cnt.config(text=str(n))
            if n > 0:
                dlg.after(1000, tick, n - 1)
                return
            x, y = get_mouse_pos()
            self.ac_click_pos = (x, y)
            self.ac_lbl_click_pos.config(text=f"({x},{y})", fg=AUTOCLICKER_C["text"])
            lbl.config(text=f"✓ Kliknięcia w: ({x}, {y})")
            cnt.config(text="✓", fg=AUTOCLICKER_C["success"])
            dlg.after(1200, dlg.destroy)

        dlg.after(300, tick, 3)

    def _ac_sample_idle(self):
        if not self.ac_region:
            messagebox.showinfo("Info", "Najpierw ustaw obszar.")
            return
        x, y, w, h = self.ac_region
        img = grab_region(x, y, w, h)
        if img is None:
            messagebox.showerror("Błąd", "Nie udało się pobrać obrazu.")
            return
        color = avg_color(img)
        self.ac_idle_color = color
        hx = "#{:02x}{:02x}{:02x}".format(*color)
        self.ac_idle_preview.config(bg=hx, text=f"{hx}")
        self.ac_lbl_idle.config(text=f"{color}", fg=AUTOCLICKER_C["text"])

    def _ac_start(self):
        if not self.ac_region:
            messagebox.showinfo("Info", "Ustaw obszar.")
            return
        if not self.ac_click_pos:
            messagebox.showinfo("Info", "Ustaw miejsce kliknięcia.")
            return
        if not self.ac_idle_color:
            messagebox.showinfo("Info", "Próbkuj kolor spoczynku.")
            return
        self.ac_running = True
        self.ac_click_count = 0
        self.ac_btn_start.config(state="disabled")
        self.ac_btn_stop.config(state="normal")
        self.ac_lbl_status.config(text="▶ Monitoruję", fg=AUTOCLICKER_C["success"])
        threading.Thread(target=self._ac_loop, daemon=True).start()

    def _ac_stop(self):
        self.ac_running = False
        self.ac_btn_start.config(state="normal")
        self.ac_btn_stop.config(state="disabled")
        self.ac_lbl_status.config(text="⏸ Stop", fg=AUTOCLICKER_C["subtext"])

    def _ac_loop(self):
        state = "idle"
        interval = 2.00
        while self.ac_running:
            try:
                x, y, w, h = self.ac_region
                img = grab_region(x, y, w, h)
                if img is None:
                    time.sleep(interval)
                    continue
                cur = avg_color(img)
                dist = color_distance(cur, self.ac_idle_color)
                tol = self.ac_tol_var.get()
                hx = "#{:02x}{:02x}{:02x}".format(*cur)
                self.root.after(0, lambda h=hx, c=cur, d=dist: (
                    self.ac_cur_preview.config(bg=h, text=f"{h}"),
                    self.ac_lbl_cur.config(text=f"{c}"),
                    self.ac_lbl_dist.config(
                        text=f"d:{d}",
                        fg=AUTOCLICKER_C["accent"] if d > tol else AUTOCLICKER_C["subtext"]
                    )
                ))
                if state == "idle":
                    if dist > tol:
                        click_at(*self.ac_click_pos)
                        state = "clicked"
                        self.ac_click_count += 1
                        self.root.after(0, lambda d=dist: (
                            self.ac_lbl_status.config(
                                text=f"✓ Klik! (d:{d})", fg=AUTOCLICKER_C["accent"]),
                            self.ac_lbl_clicks.config(text=f"{self.ac_click_count}")
                        ))
                elif state == "clicked":
                    if dist <= tol:
                        state = "idle"
                        self.root.after(0, lambda: self.ac_lbl_status.config(
                            text="▶ Monitoruję", fg=AUTOCLICKER_C["success"]))
            except Exception:
                pass
            time.sleep(interval)

    # ==========================================
    # EMOJI CLICKER
    # ==========================================
    def init_emoji(self):
        global EMOJI_POSITIONS
        # Wczytaj zapisane pozycje
        saved_emoji = load_emoji()
        for key in EMOJI_POSITIONS:
            if key in saved_emoji and saved_emoji[key]:
                EMOJI_POSITIONS[key] = tuple(saved_emoji[key])
        # Czas ostatniego kliknięcia TAB (dla okna 5 sekund dla 1-5)
        self._emoji_tab_time = 0.0
        # Panel z cieniem
        panel = tk.Frame(self.frame_emoji, bg=COLORS["panel"], relief="flat", bd=0)
        panel.pack(fill="both", expand=True, padx=8, pady=8)
        # Nagłówek
        hdr = tk.Frame(panel, bg=COLORS["panel"])
        hdr.pack(fill="x", pady=(0, 6))
        tk.Label(hdr, text="😊 EMOJI", bg=COLORS["panel"],
                 fg=COLORS["accent"],
                 font=("Segoe UI", 10, "bold")).pack(side="left", padx=8)
        inner = tk.Frame(panel, bg=COLORS["panel"])
        inner.pack(fill="both", expand=True, padx=6, pady=3)
        # Rząd przycisków ustawiania pozycji
        pos_row = tk.Frame(inner, bg=COLORS["panel"])
        pos_row.pack(fill="x", pady=4)
        self.emoji_status = tk.Label(
            pos_row, text="Ustaw punkty",
            font=("Segoe UI", 7), bg=COLORS["panel"], fg=COLORS["subtext"]
        )
        self.emoji_status.pack(side="left", padx=4)
        for key in ["tab", "1", "2", "3", "4", "5"]:
            tk.Button(
                pos_row,
                text=key.upper(),
                width=4,
                bg=COLORS["btn_bg"], fg=COLORS["btn_text"],
                activebackground=COLORS["btn_hover"],
                activeforeground="white",
                relief="flat", cursor="hand2",
                font=("Segoe UI", 8, "bold"),
                command=lambda k=key: self._emoji_set_position(k)
            ).pack(side="left", padx=2, pady=2)
        # Wiersz zapisu / odczytu / resetu emoji
        save_row = tk.Frame(inner, bg=COLORS["panel"])
        save_row.pack(fill="x", pady=4)
        tk.Button(save_row, text="💾 Zapisz", width=9,
                  bg=COLORS["success"], fg="white", activebackground=COLORS["success"],
                  relief="flat", cursor="hand2", font=("Segoe UI", 7, "bold"),
                  command=self._emoji_save).pack(side="left", padx=2)
        tk.Button(save_row, text="📂 Wczytaj", width=9,
                  bg=COLORS["accent"], fg="white", activebackground=COLORS["accent"],
                  relief="flat", cursor="hand2", font=("Segoe UI", 7, "bold"),
                  command=self._emoji_load).pack(side="left", padx=2)
        tk.Button(save_row, text="🔄 Reset", width=8,
                  bg=COLORS["danger"], fg="white", activebackground=COLORS["danger"],
                  relief="flat", cursor="hand2", font=("Segoe UI", 7, "bold"),
                  command=self._emoji_reset_positions).pack(side="left", padx=2)
        # Start/Stop
        ctrl_row = tk.Frame(inner, bg=COLORS["panel"])
        ctrl_row.pack(fill="x", pady=4)
        tk.Button(
            ctrl_row, text="▶ Start", width=10,
            bg=COLORS["success"], fg="white",
            activebackground=COLORS["success"],
            relief="flat", cursor="hand2",
            font=("Segoe UI", 8, "bold"),
            command=self._emoji_start
        ).pack(side="left", padx=2)
        tk.Button(
            ctrl_row, text="■ Stop", width=10,
            bg=COLORS["danger"], fg="white",
            activebackground=COLORS["danger"],
            relief="flat", cursor="hand2",
            font=("Segoe UI", 8, "bold"),
            command=self._emoji_stop
        ).pack(side="left", padx=2)
        # Wskaźnik okna TAB
        self.emoji_tab_indicator = tk.Label(
            ctrl_row, text="●",
            bg=COLORS["panel"], fg="#dfe6e9",
            font=("Segoe UI", 12, "bold")
        )
        self.emoji_tab_indicator.pack(side="left", padx=4)
        tk.Label(ctrl_row, text="TAB aktywny", bg=COLORS["panel"],
                 fg=COLORS["subtext"], font=("Segoe UI", 7)).pack(side="left")
        # Aktualizuj indykator co 200ms
        self._update_tab_indicator()
        # Wyświetl zapisane pozycje w statusie
        self._emoji_refresh_status()

    def _emoji_refresh_status(self):
        set_count = sum(1 for v in EMOJI_POSITIONS.values() if v is not None)
        if set_count == 0:
            self.emoji_status.config(text="Ustaw punkty")
        else:
            self.emoji_status.config(text=f"Ustawione: {set_count}/6 pkt")

    def _update_tab_indicator(self):
        elapsed = time.time() - self._emoji_tab_time
        if elapsed < 5.0:
            remaining = int(5.0 - elapsed) + 1
            self.emoji_tab_indicator.config(fg=COLORS["success"], text=f"●{remaining}s")
        else:
            self.emoji_tab_indicator.config(fg="#dfe6e9", text="●")
        self.root.after(200, self._update_tab_indicator)

    def _emoji_save(self):
        data = {k: list(v) if v else None for k, v in EMOJI_POSITIONS.items()}
        save_emoji(data)
        self.emoji_status.config(text="✓ Pozycje zapisane")
        self.root.after(2000, self._emoji_refresh_status)

    def _emoji_load(self):
        global EMOJI_POSITIONS
        saved = load_emoji()
        if not saved:
            self.emoji_status.config(text="Brak zapisu")
            self.root.after(1500, self._emoji_refresh_status)
            return
        for key in EMOJI_POSITIONS:
            if key in saved and saved[key]:
                EMOJI_POSITIONS[key] = tuple(saved[key])
            else:
                EMOJI_POSITIONS[key] = None
        self.emoji_status.config(text="✓ Wczytano pozycje")
        self.root.after(1500, self._emoji_refresh_status)

    def _emoji_reset_positions(self):
        global EMOJI_POSITIONS
        for key in EMOJI_POSITIONS:
            EMOJI_POSITIONS[key] = None
        self._emoji_tab_time = 0.0
        self.emoji_status.config(text="↺ Pozycje wyczyszczone")
        self.root.after(1500, self._emoji_refresh_status)

    def _emoji_set_position(self, key_name):
        if getattr(self, "_emoji_setting", False):
            return  # nie pozwalaj na nakładanie się kilku odliczań naraz
        self._emoji_setting = True

        def tick(n):
            if n > 0:
                self.emoji_status.config(
                    text=f"Przesuń kursor na {key_name.upper()} – {n}s..."
                )
                self.root.after(1000, tick, n - 1)
                return
            pos = pyautogui.position()
            x, y = pos[0], pos[1]
            EMOJI_POSITIONS[key_name] = (x, y)
            self.emoji_status.config(text=f"{key_name.upper()}: {x},{y}")
            self._emoji_setting = False
            self.root.after(1500, self._emoji_refresh_status)

        tick(3)

    def _emoji_on_press(self, key):
        global emoji_running, EMOJI_POSITIONS
        if not emoji_running:
            return
        try:
            if key == keyboard.Key.tab:
                pos = EMOJI_POSITIONS["tab"]
                if pos:
                    pyautogui.click(pos[0], pos[1])
                    self._emoji_tab_time = time.time()
                    self.root.after(0, lambda: self.emoji_status.config(text="Klik TAB ▶ okno 5s"))
                return

            k = getattr(key, "char", None)  # <-- zamiast key.char
            if k in ["1", "2", "3", "4", "5"]:
                elapsed = time.time() - self._emoji_tab_time
                if elapsed > 5.0:
                    self.root.after(0, lambda k=k: self.emoji_status.config(
                        text=f"⚠ {k} zignorowany – TAB nieaktywny"))
                    return
                pos = EMOJI_POSITIONS[k]
                if pos:
                    pyautogui.click(pos[0], pos[1])
                    self.root.after(0, lambda k=k: self.emoji_status.config(text=f"Klik {k}"))
        except Exception as e:
            print(f"[EMOJI ERROR] {e}")

    def _emoji_start(self):
        global emoji_running, emoji_listener
        if emoji_running:
            return
        emoji_running = True
        emoji_listener = keyboard.Listener(on_press=self._emoji_on_press)
        emoji_listener.start()
        self.emoji_status.config(text="✓ DZIAŁA")

    def _emoji_stop(self):
        global emoji_running, emoji_listener
        emoji_running = False
        if emoji_listener:
            emoji_listener.stop()
            emoji_listener = None
        self._emoji_tab_time = 0.0
        self.emoji_status.config(text="■ NIE DZIAŁA")
    
    # ==========================================
    # AUTO-KOPIUJ ZAZNACZENIE / WKLEJ SCROLL LOCK
    # ==========================================
    def init_autocopy(self):
        panel = tk.Frame(self.frame_autocopy, bg=COLORS["panel"], relief="flat", bd=0)
        panel.pack(fill="both", expand=True, padx=8, pady=8)

        hdr = tk.Frame(panel, bg=COLORS["panel"])
        hdr.pack(fill="x", pady=(0, 6))
        tk.Label(hdr, text="📋 AUTO-KOPIUJ / SCROLL LOCK", bg=COLORS["panel"],
                 fg=COLORS["accent"],
                 font=("Segoe UI", 10, "bold")).pack(side="left", padx=8)

        inner = tk.Frame(panel, bg=COLORS["panel"])
        inner.pack(fill="both", expand=True, padx=6, pady=3)

        desc = tk.Label(
            inner,
            text="Zaznacz tekst myszką = auto-kopiuj.\nKlik kółkiem myszy = wklej.",
            bg=COLORS["panel"], fg=COLORS["subtext"],
            font=("Segoe UI", 8), justify="left"
        )
        desc.pack(anchor="w", pady=(0, 4))

        ctrl_row = tk.Frame(inner, bg=COLORS["panel"])
        ctrl_row.pack(fill="x", pady=4)

        self.autocopy_btn_start = tk.Button(
            ctrl_row, text="▶ Start", width=10,
            bg=COLORS["success"], fg="white",
            activebackground=COLORS["success"],
            relief="flat", cursor="hand2",
            font=("Segoe UI", 8, "bold"),
            command=self._autocopy_start
        )
        self.autocopy_btn_start.pack(side="left", padx=2)

        self.autocopy_btn_stop = tk.Button(
            ctrl_row, text="■ Stop", width=10,
            bg=COLORS["danger"], fg="white",
            activebackground=COLORS["danger"],
            relief="flat", cursor="hand2",
            font=("Segoe UI", 8, "bold"),
            command=self._autocopy_stop
        )
        self.autocopy_btn_stop.pack(side="left", padx=2)
        self.autocopy_btn_stop.config(state="disabled")

        self.autocopy_status = tk.Label(
            inner, text="■ NIE DZIAŁA",
            bg=COLORS["panel"], fg=COLORS["subtext"],
            font=("Segoe UI", 8, "bold")
        )
        self.autocopy_status.pack(anchor="w", pady=(6, 0))

    def _autocopy_on_click(self, x, y, button, pressed):
        global _autocopy_press_pos

        if button == mouse.Button.middle:
            if pressed:
                try:
                    _kb_controller.press(keyboard.Key.ctrl)
                    _kb_controller.press('v')
                    _kb_controller.release('v')
                    _kb_controller.release(keyboard.Key.ctrl)
                    self.root.after(0, lambda: self.autocopy_status.config(
                        text="✓ Wklejono", fg=COLORS["accent"]))
                    self.root.after(1500, lambda: self.autocopy_status.config(
                        text="✓ DZIAŁA", fg=COLORS["success"]) if autocopy_running else None)
                except Exception as e:
                    print(f"[AUTOCOPY ERROR] {e}")
            return

        if button != mouse.Button.left:
            return
        if pressed:
            _autocopy_press_pos = (x, y)
        else:
            if _autocopy_press_pos:
                dx = x - _autocopy_press_pos[0]
                dy = y - _autocopy_press_pos[1]
                dist = (dx * dx + dy * dy) ** 0.5
                if dist > _autocopy_drag_threshold:
                    time.sleep(0.05)
                    try:
                        _kb_controller.press(keyboard.Key.ctrl)
                        _kb_controller.press('c')
                        _kb_controller.release('c')
                        _kb_controller.release(keyboard.Key.ctrl)
                        self.root.after(0, lambda: self.autocopy_status.config(
                            text="✓ Skopiowano zaznaczenie", fg=COLORS["success"]))
                        self.root.after(1500, lambda: self.autocopy_status.config(
                            text="✓ DZIAŁA", fg=COLORS["success"]) if autocopy_running else None)
                    except Exception as e:
                        print(f"[AUTOCOPY ERROR] {e}")
            _autocopy_press_pos = None

    def _autocopy_start(self):
        global autocopy_running, autocopy_mouse_listener
        if autocopy_running:
            return
        autocopy_running = True
        autocopy_mouse_listener = mouse.Listener(on_click=self._autocopy_on_click)
        autocopy_mouse_listener.start()
        self.autocopy_btn_start.config(state="disabled")
        self.autocopy_btn_stop.config(state="normal")
        self.autocopy_status.config(text="✓ DZIAŁA", fg=COLORS["success"])

    def _autocopy_stop(self):
        global autocopy_running, autocopy_mouse_listener
        autocopy_running = False
        if autocopy_mouse_listener:
            autocopy_mouse_listener.stop()
            autocopy_mouse_listener = None
        self.autocopy_btn_start.config(state="normal")
        self.autocopy_btn_stop.config(state="disabled")
        self.autocopy_status.config(text="■ NIE DZIAŁA", fg=COLORS["subtext"])


# ============================================
# URUCHOMIENIE
# ============================================
if __name__ == "__main__":
    root = tk.Tk()
    app = MainApp(root)
    root.mainloop()