use clap::Parser;

#[derive(Parser)]
struct Args {
    #[arg(short, long, default_value_t = String::from("world"))]
    name: String,
}

fn main() {
    let args = Args::parse();
    println!("Hello, {}!", args.name);
}
