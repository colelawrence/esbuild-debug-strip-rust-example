use std::io::Write;

pub struct TypeScriptSource<'a> {
    pub ms: magic_string::MagicString,
    pub original: &'a str,
    source_path: &'a str,
}

impl<'a> TypeScriptSource<'a> {
    pub fn new(source_path: &'a str, original: &'a str) -> Self {
        let ms = magic_string::MagicString::new(&original);
        Self {
            ms,
            source_path,
            original,
        }
    }

    pub fn write_with_inline_source_map<W: std::io::Write>(&self, mut w: &mut W) {
        writeln!(&mut w, "{}", self.ms.to_string()).expect("can write");
        let gen_opts = {
            let mut opts = magic_string::GenerateDecodedMapOptions::default();
            opts.source = Some(self.source_path.to_string());
            opts.include_content = true;
            // opts.source_root = Some(String::from("./src"));

            opts
        };
        let map = self.ms.generate_map(gen_opts).expect("generated map");
        writeln!(
            &mut w,
            "//# sourceMappingURL={}",
            map.to_url().expect("map to url")
        )
        .expect("can write");
    }
}
