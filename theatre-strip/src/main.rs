use std::env;
use std::fs;
use std::io;
use std::process;

mod typescript_source;

use typescript_source::TypeScriptSource;

fn main() {
    let source_path = env::args()
        .skip(1)
        .next()
        .expect("expected first argument for the path for the file.");

    let file_contents = match fs::read_to_string(&source_path) {
        Ok(value) => value,
        Err(err) => {
            eprintln!("Failed to read {source_path:?}: {err}");
            process::exit(err.raw_os_error().unwrap_or(1));
        }
    };

    let mut ts = TypeScriptSource::new(&source_path, &file_contents);

    ignore_console_log(&mut ts);
    replace_dev_with_process_node_env_check(&mut ts);

    // print
    ts.write_with_inline_source_map(&mut io::stdout())
}

fn replace_dev_with_process_node_env_check(ts: &mut TypeScriptSource<'_>) {
    for (idx, matched_str) in ts.original.match_indices("__DEV__") {
        ts.ms
            .remove(idx as i64, (idx + matched_str.len()) as i64)
            .expect("remove __DEV__");
        ts.ms
            .append_left(idx as u32, "process.env.NODE_ENV !== 'production'")
            .expect("append left");
    }
}

fn ignore_console_log(ts: &mut TypeScriptSource<'_>) {
    for (idx, _) in ts.original.match_indices("console") {
        ts.ms
            .append_left(idx as u32, "undefined && ")
            .expect("append left");
    }

    for (idx, _) in ts.original.match_indices("dev.") {
        ts.ms
            .append_left(idx as u32, "undefined && ")
            .expect("append left");
    }
}
