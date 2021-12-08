let request = require("request-promise");
const cheerio = require("cheerio");

const API_SERVER = "http://daotao.hutech.edu.vn";

class APIHutech {
  constructor() {
    this.jar = request.jar();
    request = request.defaults({
      headers: {
        "Cache-Control": "max-age=0",
        "Upgrade-Insecure-Requests": 1,
        DNT: 1,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "multipart/form-data",
        Connection: "keep-alive",
      },
    });
  }

  requestServer(data = { pathURI, formData: "", isTransform: false }) {
    let form = {
      uri: API_SERVER + data.pathURI,
      jar: this.jar,
      method: typeof data.formData === "object" ? "post" : "get",
      formData: data.formData,
    };

    if (data.isTransform) form.transform = (body) => cheerio.load(body);
    return request(form);
  }

  getSchedule() {
    return new Promise(async (resolve, reject) => {
      try {
        let schedule = [
          {
            account: null,
            data: [],
          },
        ];

        const $ = await this.requestServer({
          pathURI: "/default.aspx?page=thoikhoabieu&sta=0",
          isTransform: true,
        });

        let name = $("#ctl00_Header1_Logout1_lblNguoiDung").text();
        schedule[0].account = name.slice(9);
        $("#ctl00_ContentPlaceHolder1_ctl00_Table1 tbody tr")
          .children()
          .each(function (i) {
            let e = $(this).attr("onmouseover");
            if (e) {
              let item = e.slice(10).replaceAll("'", "").split(",");
              let data = {
                subject: item[1],
                codeSubject: item[2],
                weekday: item[3],
                room: item[5],
                start: item[6],
                date: item[9],
              };
              schedule[0].data.push(data);
            }
          });
        resolve(schedule);
      } catch (error) {
        reject(error);
      }
    });
  }

  login({ user, pass }) {
    return new Promise(async (resolve, reject) => {
      try {
        const $ = await this.requestServer({
          pathURI: "/default.aspx",
          formData: {
            __EVENTTARGET: "",
            __EVENTARGUMENT: "",
            ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtTaiKhoa: user,
            ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtMatKhau: pass,
            ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$btnDangNhap: "Đăng Nhập",
          },
          isTransform: true,
        });
        let name = $("#ctl00_Header1_Logout1_lblNguoiDung").text();
        if (name.length > 9) {
          resolve(this.jar);
        } else {
          console.log("password wrong");
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = APIHutech;
