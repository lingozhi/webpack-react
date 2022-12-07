import ExcelJs from "exceljs";
import { useState, useEffect } from "react";
import asrc from "../assets/imgs/a.png";
const mockData = [
    {
        Name: "Allen",
        Gender: "Male",
        Height: "175",
    },
    {
        Name: "Tom",
        Gender: "Male",
        Height: "180",
    },
    {
        Name: "Jane",
        Gender: "Female",
        Height: "170",
    },
];

const ExportToExcel = () => {
    const [base64, setBase64] = useState();
    const exportToExcel = (data: any[]) => {
        const sheetName = "Allen_test.xlsx";
        const headerName = "RequestsList";

        // 获取sheet对象，设置当前sheet的样式
        // showGridLines: false 表示不显示表格边框
        const workbook = new ExcelJs.Workbook();
        const sheet = workbook.addWorksheet(sheetName, {
            views: [{ showGridLines: false }],
        });
        // let sheet2 = workbook.addWorksheet("Second sheet", { views: [{ showGridLines: false }] });

        // 获取每一列的header
        const columnArr = [];
        for (const i in data[0]) {
            const tempObj = { name: "" };
            tempObj.name = i;
            columnArr.push(tempObj);
        }

        // 设置表格的头部信息，可以用来设置标题，说明或者注意事项
        sheet.addTable({
            name: `Header`,
            ref: "A1", // 头部信息从A1单元格开始显示
            headerRow: true,
            totalsRow: false,
            style: {
                theme: undefined,
                showRowStripes: false,
                showFirstColumn: true,
                // width: 200,
            },
            columns: [{ name: "This is the header text" }, { name: "Hahaha" }],
            rows: [[`As of: 07/09/2021`], [`Allen`]],
        });

        // 设置表格的主要数据部分
        sheet.addTable({
            name: headerName,
            ref: "A5", // 主要数据从A5单元格开始
            headerRow: true,
            totalsRow: false,
            style: {
                theme: "TableStyleMedium2",
                showRowStripes: false,
                // width: 200,
            },
            columns: columnArr ? columnArr : [{ name: "" }],
            rows: data.map(e => {
                const arr = [];
                for (const i in e) {
                    arr.push(e[i]);
                }
                return arr;
            }),
        });

        sheet.getCell("A1").font = { size: 20, bold: true }; // 设置单元格的文字样式

        // 设置每一列的宽度
        sheet.columns = sheet.columns.map((e: any) => {
            const expr = e.values[5];
            switch (expr) {
                case "Name":
                    return { width: 500 };
                case "Gender":
                    return { width: 40 };
                case "Height":
                    return { width: 30 };
                default:
                    return { width: 20 };
            }
        });

        const table: any = sheet.getTable(headerName);
        for (let i = 0; i < table.table.columns.length; i++) {
            // 表格主体数据是从A5开始绘制的，一共有三列。这里是获取A5到，B5，C5单元格，定义表格的头部样式
            sheet.getCell(`${String.fromCharCode(65 + i)}5`).font = { size: 12 };
            sheet.getCell(`${String.fromCharCode(65 + i)}5`).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "c5d9f1" },
            };

            // 获取表格数据部分，定义其样式
            for (let j = 0; j < table.table.rows.length; j++) {
                const rowCell = sheet.getCell(`${String.fromCharCode(65 + i)}${j + 6}`);
                rowCell.alignment = { wrapText: true };
                rowCell.border = {
                    bottom: {
                        style: "thin",
                        color: { argb: "a6a6a6" },
                    },
                };
            }
        }
        table.commit();
        const imageId2 = workbook.addImage({
            base64: `${base64}`,
            extension: "png",
        });
        sheet.addImage(imageId2, "B2:D6");

        const writeFile = (fileName: string, content: BlobPart) => {
            const link = document.createElement("a");
            const blob = new Blob([content], {
                type: "application/vnd.ms-excel;charset=utf-8;",
            });
            link.download = fileName;
            link.href = URL.createObjectURL(blob);
            link.click();
        };

        // 表格的数据绘制完成，定义下载方法，将数据导出到Excel文件
        workbook.xlsx.writeBuffer().then(buffer => {
            writeFile(sheetName, buffer);
        });
    };
    const changeBase64 = (url: string) => {
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

    useEffect(() => {
        changeBase64(asrc);
    }, []);
    return (
        <button
            onClick={() => {
                exportToExcel(mockData);
            }}
        >
            Export to Excel
        </button>
    );
};

export default ExportToExcel;
