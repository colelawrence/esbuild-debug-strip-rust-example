use std::env;
use std::fs;
use std::process;

fn main() {
    let mut args = env::args().skip(1);
    // let project_root_path = args
    //     .next()
    //     .expect("expected first argument for the project root.");
    let file_path = args
        .next()
        .expect("expected first argument for the path for the file.");

    let file_contents = match fs::read_to_string(&file_path) {
        Ok(value) => value,
        Err(err) => {
            eprintln!("Failed to read {file_path:?}: {err}");
            process::exit(err.raw_os_error().unwrap_or(1));
        }
    };

    let mut ms = magic_string::MagicString::new(&file_contents);
    if let Some(idx) = file_contents.find("console") {
        ms.remove(idx as i64, (idx + 7) as i64)
            .expect("remove console");
    }
    // let source_map =
    //     match parcel_sourcemap::SourceMap::from_buffer(&project_root_path, &file_contents) {
    //         Ok(value) => value,
    //         Err(err) => {
    //             eprintln!(
    //                 "Failed to create a sourcefile from input {file_path:?} {}:\n{:?}",
    //                 err.reason
    //                     .map_or_else(String::new, |reason| format!("\"{reason}\"")),
    //                 err.error_type
    //             );
    //             process::exit(1);
    //         }
    //     };

    // ms.

    println!("{}", ms.to_string());
    let gen_opts = {
        let mut opts = magic_string::GenerateDecodedMapOptions::default();
        opts.file = Some(file_path);
        opts.include_content = true;

        opts
    };
    let map = ms.generate_map(gen_opts).expect("generated map");
    println!("//# sourceMappingURL={}", map.to_url().expect("map to url"));
}
