import { useState, useEffect, ReactNode } from "react";
import { Button } from "antd";
import Excel from "exceljs";
import { SizeType } from "antd/es/config-provider/SizeContext";
import asrc from "../assets/imgs/a.png";

/**
  text?: string // 下载按钮内文字
  icon?: string // 按钮 icon
  size?: string // 按钮尺寸
  type?: string // 按钮类型
  execlTitle?: string // 导出execl文件名
  tableColumns: [] // 表头
  selectedUrl: string // 接口地址url
 */

interface Props {
    size?: SizeType;
    text?: string;
    type?: "link" | "text" | "dashed" | "default" | "ghost" | "primary" | undefined;
    icon?: ReactNode;
    selectedUrl?: string;
    execlTitle?: string;
}

const TableDownload = ({
    size = "middle",
    text = "导出",
    type = "default",
    icon = "download",
    selectedUrl,
    execlTitle = "表格数据",
}: Props) => {
    const [base64, setBase64] = useState();
    const [isLoading, setLoading] = useState(false);
    const [tableRows, setTableData] = useState([
        {
            id: 1,
            name: "tom",
            age: "18",
        },
        {
            id: 2,
            name: "jim",
            age: "25",
        },
        {
            id: 3,
            name: "tim",
            age: "25",
        },
    ]);
    const [tableColumns, setTableColumns] = useState([
        {
            dataIndex: "name",
            title: "姓名",
            width: "",
        },
        {
            dataIndex: "age",
            title: "年龄",
            width: "",
        },
    ]);
    const changeBase64 = (url: any) => {
        const imgSrc = url; // 图片本地路劲
        const image = new Image();
        image.setAttribute("crossOrigin", "Anonymous");
        image.src = imgSrc;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(image, 0, 0, image.width, image.height);
            const ext = image.src.substring(image.src.lastIndexOf(".") + 1).toLowerCase();
            const dataUrl = canvas.toDataURL("image/" + ext);
            setBase64(JSON.parse(JSON.stringify(dataUrl)));
        };
    };
    // 执行下载表格
    const fetchTableDatas = () => {
        // 初始化 创建工作簿
        const workbook = new Excel.Workbook();
        // 设置工作簿属性
        workbook.creator = "admin";
        workbook.lastModifiedBy = "admin";
        workbook.created = new Date();
        workbook.modified = new Date();

        // 添加工作表
        const sheet = workbook.addWorksheet("sheet");
        // const myBase64Image = getImgBase64();
        const imageId2 = workbook.addImage({
            base64: `${base64}`,
            extension: "png",
        });
        sheet.addImage(imageId2, "B2:N40");
        const columns: Partial<Excel.Column>[] | { header: any; key: any; width: any }[] = [];
        // 表头格式化
        tableColumns.map(item => {
            columns.push({
                header: item["title"],
                key: item["dataIndex"],
                width: parseInt(item["width"]) / 6 || 40,
            });
            return true;
        });

        // 添加表头
        sheet.columns = columns;

        if (Array.isArray(tableRows)) {
            // 添加表格数据
            sheet.addRows(tableRows);

            // 设置每一列样式 居中
            const row = sheet.getRow(1);
            row.eachCell((cell, rowNumber) => {
                sheet.getColumn(rowNumber).alignment = {
                    vertical: "middle",
                    horizontal: "center",
                };
            });

            // 将表格数据转为二进制
            workbook.xlsx.writeBuffer().then(buffer => {
                writeFile(`${execlTitle}.xlsx`, buffer);
            });
        } else {
            alert("下载失败");
        }
    };

    // 将二进制转为Excel并下载
    const writeFile = (
        fileName: string,
        content: string | Excel.Buffer | ArrayBufferView | Blob
    ) => {
        const a = document.createElement("a");
        const blob = new Blob([content], { type: "text/plain" });

        a.download = fileName;
        a.href = URL.createObjectURL(blob);

        a.click();
    };
    useEffect(() => {
        // setLoading(true);
        // fetch(selectedUrl)
        //     .then(response => response.json())
        //     .then(({ data }) => {
        //         setTableColumns(data && data.columns);
        //         setTableData(data && data.rows);
        //         setTimeout(() => {
        //             setLoading(false);
        //         }, 2000);
        //     });
        setLoading(false);
        changeBase64(asrc);
    }, [selectedUrl]);
    return (
        <div style={{ padding: 10, margin: 10, border: "1px solid red" }}>
            <Button
                type={type}
                icon={icon || ""}
                size={size}
                loading={isLoading}
                onClick={fetchTableDatas}
            >
                {isLoading ? "正在导出" : text}
            </Button>
        </div>
    );
};

export default TableDownload;
