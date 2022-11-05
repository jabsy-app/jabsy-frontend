#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::net::{TcpStream};
use std::fs::{write, read_to_string, remove_file};
use std::path::Path;
use tauri::Window;
use std::io::Cursor;
use image::io::Reader as ImageReader;
use bcrypt;
use rand::Rng;

#[tauri::command]
fn hash_from_password(password: &str) -> String {
    let mut rng = rand::thread_rng();
    const DEFAULT_COST: u32 = 10;
    const MAX_SALT_SIZE: usize = 16;

    let salt = {
        let mut unencoded = [0u8; MAX_SALT_SIZE];
        for i in 0..unencoded.len() {
            unencoded[i] = (rng.gen::<f32>() * 255.0) as u8
        }
        unencoded
    };
    let output = bcrypt::bcrypt(DEFAULT_COST,
        salt.clone(),
        password.as_bytes()
    );
    let mut salt_str = String::new();
    let mut hash_str = String::new();

    for b in salt {
        salt_str.push(b as char);
    }

    for b in output {
        hash_str.push(b as char);
    }

    base64::encode(format!("{}:{}", salt_str, hash_str).as_bytes())
}

#[tauri::command]
fn hash_from_salt(password: &str, salt_str: &str) -> String {
    const DEFAULT_COST: u32 = 10;

    let mut salt = [0u8; 16];

    for i in 0..16 {
        salt[i] = salt_str.chars().nth(i).unwrap() as u8;
    }

    let output = bcrypt::bcrypt(DEFAULT_COST,
        salt.clone(),
        password.as_bytes()
    );
    let mut salt_str = String::new();
    let mut hash_str = String::new();

    for b in salt {
        salt_str.push(b as char);
    }

    for b in output {
        hash_str.push(b as char);
    }

    base64::encode(format!("{}:{}", salt_str, hash_str).as_bytes())
}


// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}

#[tauri::command]
fn connect(window: Window, ip: &str) {
    match TcpStream::connect(ip) {
        Ok(mut _stream) => {
            println!("Successfully connected to server in port 3333");
            window.emit("ChatMessageReceived", Payload { message: "lol".into() }).unwrap();
        },
        Err(e) => {
            println!("Failed to connect: {}", e);
        }
    }
}

#[tauri::command]
fn get_file(path: String, default: String) -> String {
    if Path::new(&path).exists() {
        let content = read_to_string(path).unwrap();
        if content.len() > 0    { content }
        else                    { default }
    }
    else {
        default
    }
}

#[tauri::command]
fn write_file(path: &str, value: &str) {
    if Path::new(&path).exists() {
        remove_file(path).expect("Filesystem Error");
    }
    write(path, value).expect("Filesystem Error");
}

#[tauri::command]
fn shrink_image(img: String, x: u32, y: u32, x2: u32, y2: u32, w: u32, h:u32) -> String {
    let path = format!("{}{}", std::env::temp_dir().display() ,"image.png");
    let path = Path::new(&path[..]);
    let bytes = base64::decode(&img[img.find(',').unwrap()+1..]).unwrap();
    let img = ImageReader::new(Cursor::new(bytes)).with_guessed_format().unwrap().decode().unwrap();
    let img = image::imageops::crop_imm(&img, x2, y2, w, h).to_image();
    let img = image::DynamicImage::from(image::imageops::resize(&img, x, y, image::imageops::FilterType::Lanczos3));
    image::save_buffer(&path, img.as_bytes(), x, y, image::ColorType::Rgba8).expect("Image / Filesystem Error");
    let png = format!("data:image/png;base64,{}", base64::encode(std::fs::read(path).unwrap()));
    remove_file(path).expect("Filesystem Error");
    return png;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![connect, get_file, write_file, shrink_image, hash_from_password, hash_from_salt])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
