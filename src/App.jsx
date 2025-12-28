import React, { useContext, useMemo } from "react";
import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  CopyOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileOutlined,
  FileTextOutlined,
  GithubOutlined,
  HolderOutlined,
  HomeOutlined,
  LeftCircleOutlined,
  LoadingOutlined,
  MoonOutlined,
  PlusOutlined,
  RightCircleFilled,
  SunOutlined,
  SwitcherOutlined,
  TableOutlined,
  TranslationOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Card,
  Col,
  Collapse,
  ColorPicker,
  ConfigProvider,
  Divider,
  Flex,
  Image,
  Input,
  InputNumber,
  Layout,
  Menu,
  message,
  Modal,
  Row,
  Select,
  Slider,
  Spin,
  Statistic,
  Switch,
  Table,
  theme,
  Timeline,
  // Tour,
  Typography,
  Upload,
  Watermark,
} from "antd";
import { Button, Steps } from "antd";
import logo from "./assets/icon.png";
// import thumbUp from "./assets/emoticon_thumbup_gray.png";
// import smile from "./assets/emoticon_smiley_gray.png";
import Title from "antd/es/typography/Title";
import Marquee from "react-fast-marquee";
import fs from "file-saver";
import html2canvas from "html2canvas";
import moment from "moment";
import translData from "./data.json";
import { useVercount } from "vercount-react";
import CountUp from "react-countup";
import priceData from "./price.json";
import priceTxt from "./og_price.json";
import useLocalStorageState from "use-local-storage-state";
import { Route, Routes, useNavigate } from "react-router-dom";
import RwrTable from "./Table";
import { useTranslation } from "react-i18next";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const formatter = (value) => <CountUp end={value} separator="," />;

const { Header, Content, Footer, Sider } = Layout;
function removeDuplicates(arr) {
  const seen = new Map();
  return arr.filter((item) => {
    if (!seen.has(item.key)) {
      seen.set(item.key, true);
      return true;
    }
    return false;
  });
}

const imageModules = import.meta.glob("./assets/items/*.png", { eager: true });

const preloadedUrls = Object.fromEntries(
  Object.entries(imageModules).map(([path, module]) => [path, module.default])
);

const lines = [
  "梦想只是梦想，不能当饭吃。那我就不吃。我只是害怕如果我今天死掉，或许就这样一事无成，过完一生。——《心灵奇旅》",
  "由衷感谢所有对本项目提供帮助的游戏玩家以及社区成员。30年后有人问起RWR是什么，哦，那是一个漫长而愉快的梦。",
  "圣诞快乐，劳伦斯先生。",
  "强者救赎自己，圣人普度他人。——《肖申克的救赎》",
  "希望是美好的，也许是人间至善，而美好的事物永不消逝。——《肖申克的救赎》",
  "有的鸟终究是关不住的，因为他们的羽翼太过光辉——《肖申克的救赎》",
];

const unitTrans = (num) => {
  const absNum = Math.abs(num);
  let value, unit;

  if (absNum >= 1e12) {
    value = num / 1e12;
    unit = "t";
  } else if (absNum >= 1e9) {
    value = num / 1e9;
    unit = "b";
  } else if (absNum >= 1e6) {
    value = num / 1e6;
    unit = "m";
  } else if (absNum >= 1e3) {
    value = num / 1e3;
    unit = "k";
  } else {
    return num.toString();
  }

  // 将数字转换为字符串保留所有小数
  const strVal = value.toString();

  // 处理科学计数法 (大于1e21的数字会自动转科学计数法)
  if (strVal.includes("e")) {
    return value.toLocaleString("fullwide", { useGrouping: false }) + unit;
  }

  return strVal + unit;
};

const extractCommitInfo = (commits) => {
  return commits.map((commit) => {
    // 从commit.commit.author获取提交者信息
    const authorInfo = commit.commit.author;

    // 返回提取的信息
    return {
      label: authorInfo.date,
      children: <a href={commit.html_url}>{commit.commit.message}</a>,
    };
  });
};

const RowContext = React.createContext({});
const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: "move" }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

const DRow = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] });
  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };
  const contextValue = useMemo(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  );
  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const App = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setData((prevState) => {
        const activeIndex = prevState.findIndex(
          (record) => record.key === active?.id
        );
        const overIndex = prevState.findIndex(
          (record) => record.key === over?.id
        );
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
  };

  const navItem = [
    {
      key: "1",
      label: t("pages"),
      icon: <FileOutlined />,
      children: [
        {
          key: "1.1",
          label: <a href="/#/">{t("home")}</a>,
          icon: <HomeOutlined />,
        },
        {
          key: "1.2",
          label: <a href="/#/table">{t("table")}</a>,
          icon: <TableOutlined />,
        },
      ],
    },
    {
      key: "2",
      label: t("experi"),
      icon: <TranslationOutlined />,
      children: [
        {
          key: "zh",
          label: "中文",
          icon: <SwitcherOutlined />,
        },
        {
          key: "en",
          label: "English",
          icon: <SwitcherOutlined />,
        },
      ],
    },
  ];

  const [commitHistory, setCommitHistory] = React.useState([]);
  React.useEffect(() => {
    const fetchCommits = async () => {
      const response = await fetch(
        "https://api.github.com/repos/bananaxiao2333/rwrsg/commits"
      );
      const jsonData = await response.json();
      setCommitHistory(extractCommitInfo(jsonData));
    };
    fetchCommits();
  }, []);

  const getRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * lines.length);
    return lines[randomIndex];
  };
  const [randomItem, setRandomItem] = React.useState("");
  React.useEffect(() => {
    setRandomItem(getRandomItem());
  }, []);

  const [imageUrls, setImageUrls] = React.useState({});
  const [spinning, setSpinning] = React.useState(false);
  React.useEffect(() => {
    setSpinning(true);
    message.open({
      type: "info",
      // content: t("app.currentTip", { num: Object.keys(preloadedUrls).length }),
      content: t("app.currentTip", { num: Object.keys(translData).length }),
      duration: 3,
    });

    setImageUrls(preloadedUrls);
    setSpinning(false);
  }, []);
  const [currentTime, setCurrentTime] = React.useState(new moment().format());
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new moment().format());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  var opti = [];
  Object.entries(translData).forEach((key, value) => {
    var n = key[0];
    
    opti = opti.concat([
      {
        value: n,
        label:
          i18n.language == "zh"
            ? translData[n]?.cn_name
              ? `${translData[n].cn_name + "-" + translData[n].en_name} (${n})`
              : n
            : translData[n]?.en_name
            ? `${translData[n].en_name} (${n})`
            : n,
      },
    ]);
  });
  // Object.entries(imageUrls).forEach((key, value) => {
  //   var n = key[0].replace("./assets/items/", "").replace(".png", "");
  //   opti = opti.concat([
  //     {
  //       value: n,
  //       label:
  //         i18n.language == "zh"
  //           ? translData[n]?.cn_name
  //             ? `${translData[n].cn_name + "-" + translData[n].en_name} (${n})`
  //             : n
  //           : translData[n]?.en_name
  //           ? `${translData[n].en_name} (${n})`
  //           : n,
  //     },
  //   ]);
  // });

  const ref1 = React.useRef(null);
  const ref2 = React.useRef(null);
  const ref3 = React.useRef(null);
  const ref4 = React.useRef(null);
  const ref5 = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  // const tSteps = [
  //   {
  //     title: "欢迎",
  //     description: "欢迎使用RWRSG，我们来进行一个简单的漫游式引导以熟悉界面",
  //     cover: <img src={smile} style={{ maxWidth: "100px" }} />,
  //   },
  //   {
  //     title: "导入数据",
  //     description: "导入被导出数据。注意：重复部分会自动合并，或者去重",
  //     target: () => ref1.current,
  //   },
  //   {
  //     title: "下一步",
  //     description: "前往下一个步骤",
  //     target: () => ref2.current,
  //   },
  //   {
  //     title: "添加售卖物",
  //     description: "你可以多选售卖物一次性添加",
  //     target: () => ref3.current,
  //   },
  //   {
  //     title: "物品表单",
  //     description: "在这里预览你选择的售卖物",
  //     target: () => ref4.current,
  //   },
  //   {
  //     title: "进度条",
  //     description: "指示正在进行和即将进行的步骤",
  //     target: () => ref5.current,
  //   },
  //   {
  //     title: "导览结束",
  //     description: "那么我们就到这里，接下来自己发挥。干杯！继续奔跑下去！",
  //     cover: <img src={thumbUp} style={{ maxWidth: "100px" }} />,
  //   },
  // ];
  const [data, setData] = useLocalStorageState("data", {
    defaultValue: [
      { key: "lottery", name: "彩票", price: 1700, num: 1 },
      { key: "vest3", name: "Ⅲ型防弹背心", price: 200, num: 2 },
      { key: "aug", name: "斯太尔AUG突击步枪", price: 250, num: 5 },
    ],
  });
  const columns = [
    { key: "sort", align: "center", width: 80, render: () => <DragHandle /> },
    {
      title: t("pic"),
      dataIndex: "key",
      key: "key",
      render: (text) => (
        <>
          <Image
            width={50}
            src={imageUrls["./assets/items/" + text + ".png"]}
            fallback="data:image/png;base64,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"
          />
        </>
      ),
    },
    {
      title: t("key"),
      dataIndex: "key",
      key: "key",
    },
    {
      title: t("action"),
      key: "delete",
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => {
            setData(
              removeDuplicates(
                data.filter(function (item) {
                  return item.key !== record.key;
                })
              )
            );

            if (record.key.length > 0)
              message.open({
                type: "success",
                content: t("delete") + " " + record.name,
                duration: 3,
              });
          }}
          style={{ textWrap: "wrap" }}
        />
      ),
    },
  ];
  const [editKey, setEditKey] = React.useState("");
  const [editMode, setEditMode] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const columns2 = [
    {
      title: t("pic") + "/" + t("key"),
      dataIndex: "key",
      key: "key",
      fixed: "right",
      render: (text, record) => (
        <div>
          <Image
            width={50}
            src={imageUrls["./assets/items/" + text + ".png"]}
            fallback="data:image/png;base64,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"
          />
          <Button
            type="link"
            size="small"
            autoInsertSpace={false}
            onClick={() => {
              setEditKey(record),
                setEditMode("name"),
                setEditModal(record.name),
                setIsModalOpen(true);
            }}
          >
            {record.name ? <>{record.name}</> : <>{t("unset")}</>}
          </Button>
        </div>
      ),
    },
    {
      title: t("key"),
      dataIndex: "key",
      key: "key",

      responsive: ["sm"],
    },
    {
      title: t("price") + "(rp)",
      dataIndex: "price",
      key: "price",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.price - b.price,

      render: (text, record) => (
        <>
          <Button
            type="link"
            autoInsertSpace={false}
            onClick={() => {
              setEditKey(record),
                setEditMode("price"),
                setEditModal(record.price),
                setIsModalOpen(true);
            }}
          >
            {text ? <>{text}rp</> : <>{t("unset")}</>}
          </Button>
        </>
      ),
    },
    {
      title: t("num"),
      dataIndex: "num",
      key: "num",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.num - b.num,

      render: (text, record) => (
        <>
          <Button
            type="link"
            autoInsertSpace={false}
            onClick={() => {
              setEditKey(record),
                setEditMode("num"),
                setEditModal(record.num),
                setIsModalOpen(true);
            }}
          >
            {text ? <>{text}</> : <>{t("unset")}</>}
          </Button>
        </>
      ),
    },
  ];

  const [addChoise, setAddChoice] = React.useState([]);
  const handleAddChoiseChange = (value) => {
    setAddChoice(value);
  };
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "delete",
        onSelect: (changeableRowKeys) => {
          //console.log("orgin data:", data);
          //console.log("rows to del:", selectedRowKeys);
          var newData = data.filter(function (item) {
            var delFlag = false;
            selectedRowKeys.forEach((itemToDel) => {
              //console.log("current:", item, "target:", itemToDel);
              //console.log("out:", item.key == itemToDel);
              if (item.key == itemToDel) delFlag = true;
            });
            return !delFlag;
          });
          //console.log("result data:", newData);
          setData(removeDuplicates(newData));
          if (selectedRowKeys.join().length > 0)
            message.open({
              type: "success",
              content: t("delete") + " " + selectedRowKeys.join(),
              duration: 3,
            });
          setSelectedRowKeys([]);
        },
      },
    ],
  };
  const [editModal, setEditModal] = React.useState();
  const canvasRef = React.useRef(null);
  const [editableStr, setEditableStr] = useLocalStorageState("title", {
    defaultValue: t("rwrsg"),
  });
  const [discount, setDiscount] = useLocalStorageState("discount", {
    defaultValue: 0,
  });
  const [picWidth, setPicWidth] = useLocalStorageState("picWidth");
  const [showName, setShowName] = useLocalStorageState("showName", {
    defaultValue: false,
  });
  const [showPrice, setShowPrice] = useLocalStorageState("showPrice", {
    defaultValue: true,
  });
  const [showID, setShowID] = useLocalStorageState("showID", {
    defaultValue: false,
  });
  const [showTitle, setShowTitle] = useLocalStorageState("showTitle", {
    defaultValue: false,
  });
  const [showNum, setShowNum] = useLocalStorageState("showNum", {
    defaultValue: false,
  });
  const [transUnit, setTransUnit] = useLocalStorageState("transUnit", {
    defaultValue: true,
  });
  const [original, setOriginal] = useLocalStorageState("original", {
    defaultValue: true,
  });
  const [color, setColor] = useLocalStorageState("color", {
    defaultValue: "#ffffff",
  });
  const [txtColor, setTxtColor] = useLocalStorageState("txtColor", {
    defaultValue: "#000000",
  });
  const [useFont, setUseFont] = useLocalStorageState("useFont", {
    defaultValue: true,
  });
  const { Paragraph, Text } = Typography;
  const [pageS, setPageS] = React.useState({
    pageSize: 30,
    showSizeChanger: true,
    showTotal: (total) => `${total}`,
  });
  const steps = [
    {
      title: t("app.items"),
      content: (
        <>
          <Row style={{ justifyContent: "space-evenly" }}>
            <Col xs={{ flex: "100%" }} sm={{ flex: "70%" }}>
              <div ref={ref4}>
                <DndContext
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={onDragEnd}
                >
                  <SortableContext
                    items={data.map((i) => i.key)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Table
                      rowKey="key"
                      components={{ body: { row: DRow } }}
                      size="small"
                      rowSelection={rowSelection}
                      columns={columns}
                      dataSource={data}
                      pagination={pageS}
                      onChange={(pagination) => {
                        setPageS(pagination);
                      }}
                    />
                  </SortableContext>
                </DndContext>
              </div>
            </Col>
            <Col xs={{ flex: "100%" }} sm={{ flex: "25%" }}>
              <Card
                title={t("app.add_items")}
                variant="borderless"
                style={{ height: "100%" }}
              >
                <div ref={ref3} style={{ height: "100%", minWidth: "0" }}>
                  <Select
                    showSearch
                    placeholder={t("app.input_name")}
                    mode="multiple"
                    size="small"
                    prefix={<AppstoreAddOutlined />}
                    optionFilterProp="label"
                    style={{ width: "200px" }}
                    onChange={handleAddChoiseChange}
                    value={addChoise}
                    options={opti}
                    tokenSeparators={[","]}
                  />
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    style={{ width: "100%", marginTop: "10px" }}
                    onClick={() => {
                      if (addChoise.join().length <= 0) return true;
                      var newData = [];
                      addChoise.forEach(function (item) {
                        newData = newData.concat([
                          {
                            key: item,
                            name:
                              i18n.language == "zh"
                                ? translData[item]?.cn_name
                                  ? `${translData[item].cn_name}`
                                  : item
                                : translData[item]?.en_name
                                ? `${translData[item].en_name}`
                                : item,
                            price: priceData[item] ?? 0,
                          },
                        ]);
                      });
                      setData(removeDuplicates(data.concat(newData)));
                      message.open({
                        type: "success",
                        content: t("add") + addChoise.join(),
                        duration: 3,
                      });
                      setAddChoice([]);
                    }}
                  />
                  <Alert
                    type="info"
                    closable
                    message={t("app.tip1")}
                    showIcon
                    style={{ margin: "10px 0" }}
                  />
                  <Collapse
                    accordion
                    items={[
                      {
                        key: "1",
                        label: t("app.tip2"),
                        children: <p>{priceTxt["txt"]}</p>,
                      },
                    ]}
                    style={{ whiteSpace: "pre-wrap" }}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: t("property"),
      content: (
        <>
          <Table virtual size="small" columns={columns2} dataSource={data} />
          <Modal
            title={
              t("set") +
              " " +
              editKey.key +
              "(" +
              editKey.name +
              ")" +
              t("'s") +
              " " +
              editMode
            }
            open={isModalOpen}
            onOk={() => {
              setData(
                data.map((item) => {
                  if (editKey.key == item.key) {
                    item[editMode] = editModal;
                  }
                  return item;
                })
              );
              setIsModalOpen(false);
            }}
            onCancel={() => setIsModalOpen(false)}
          >
            {editMode == "name" ? (
              <Input
                style={{ width: "50%" }}
                value={editModal}
                onChange={(event) => setEditModal(event.target.value)}
              />
            ) : (
              <InputNumber
                suffix={editMode == "price" ? "rp" : ""}
                style={{ width: "50%" }}
                value={editModal}
                onChange={(value) => setEditModal(value)}
              />
            )}
          </Modal>
        </>
      ),
    },
    {
      title: t("app.save"),
      content: (
        <>
          <Alert message="如果尺寸不合适可以在下方调整宽度" closable showIcon />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                border: "2px solid #0000FF",
                borderStyle: "dashed",
                backgroundColor: color,
              }}
            >
              <div
                ref={canvasRef}
                style={Object.assign(
                  { backgroundColor: color },
                  picWidth ? { width: picWidth + "px" } : {}
                )}
              >
                <Watermark
                  //height={88 / 4}
                  //width={700 / 4}
                  content={[editableStr, currentTime]}
                  //image={rwrIcon}
                >
                  <ConfigProvider
                    theme={{
                      token: {
                        colorText: txtColor,
                        colorTextDescription: txtColor,
                        fontFamily: useFont ? "komikax" : "",
                      },
                    }}
                  >
                    <Typography.Title
                      editable={{
                        tooltip: "点击来修改",
                        onChange: setEditableStr,
                      }}
                      style={{ textAlign: "center", margin: "0" }}
                    >
                      {editableStr}
                    </Typography.Title>
                    <Flex wrap gap="small" justify="center">
                      {data.map((item) => (
                        <div
                          key={item.key}
                          className="grid-item"
                          style={{
                            lineHeight: "0",
                            textAlign: "center",
                            minHeight: "100%",
                            position: "relative", // 添加相对定位
                          }}
                        >
                          <div // 图片容器
                            style={{
                              maxHeight: "200px",
                              width: "100%",
                              alignContent: "center",
                              position: "relative", // 添加相对定位
                            }}
                          >
                            <img
                              src={
                                imageUrls["./assets/items/" + item.key + ".png"]
                              }
                              style={{
                                maxHeight: "200px",
                                maxWidth: "100px",
                                margin: "0 0",
                              }}
                            />

                            {/* 新增：当original为true时显示库存标签 */}
                            {original && showNum && item.num !== undefined && (
                              <Typography
                                style={{
                                  position: "absolute",
                                  bottom: "4px",
                                  right: "4px",
                                  fontSize: "28px",
                                  lineHeight: "1.5",
                                }}
                              >
                                {item.num}
                              </Typography>
                            )}
                          </div>

                          {showName ? (
                            <Typography.Title
                              style={{ margin: "0", width: "120px" }}
                              level={5}
                            >
                              {item.name}
                            </Typography.Title>
                          ) : (
                            ""
                          )}

                          {showID ? (
                            <Typography>
                              {"("}
                              {item.key}
                              {")"}
                            </Typography>
                          ) : (
                            ""
                          )}

                          {showPrice ? (
                            <Statistic
                              title={showTitle ? "单个价格" : ""}
                              prefix={<DollarCircleOutlined />}
                              value={
                                item.price
                                  ? (transUnit
                                      ? unitTrans(
                                          (item.price * (1 - discount)).toFixed(
                                            0
                                          )
                                        )
                                      : (item.price * (1 - discount)).toFixed(
                                          0
                                        )) + " rp"
                                  : "N/A"
                              }
                            />
                          ) : (
                            ""
                          )}

                          {discount ? (
                            <Typography
                              style={{
                                height: "30px",
                                backgroundColor: "#006400", // 深绿色
                                color: "white",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontSize: "18px",
                              }}
                            >
                              -{discount * 100}%
                            </Typography>
                          ) : (
                            ""
                          )}

                          {/* 修改：当original为false时才显示库存统计 */}
                          {showNum && !original ? (
                            <Statistic
                              title={showTitle ? "库存量" : ""}
                              prefix={<AppstoreOutlined />}
                              value={item.num ? item.num + "个" : "N/A"}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      ))}
                    </Flex>
                  </ConfigProvider>
                </Watermark>
              </div>
            </div>
          </div>
          <Card title="导出设置面板">
            <div
              style={{
                gap: "20px",
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <Slider
                  placeholder="宽度"
                  value={picWidth}
                  onChange={(value) => setPicWidth(value)}
                  suffix="px"
                  changeOnWheel
                  min={1}
                  max={2000}
                  style={{ width: "200px" }}
                />
                <InputNumber
                  placeholder="宽度"
                  value={picWidth}
                  onChange={(value) => setPicWidth(value)}
                  suffix="px"
                  changeOnWheel
                  min={1}
                />
                <Button type="dashed" onClick={() => setPicWidth(470)}>
                  手机合适宽度
                </Button>
              </div>
              <Switch
                checkedChildren="显示中文名称"
                unCheckedChildren="隐藏中文名称"
                value={showName}
                onChange={() => setShowName(!showName)}
              />
              <Switch
                checkedChildren="显示物品ID"
                unCheckedChildren="隐藏物品ID"
                value={showID}
                onChange={() => setShowID(!showID)}
              />
              <Switch
                checkedChildren="显示价格"
                unCheckedChildren="隐藏价格"
                value={showPrice}
                onChange={() => setShowPrice(!showPrice)}
              />

              <Switch
                checkedChildren="转换价格单位"
                unCheckedChildren="不转换价格单位"
                value={transUnit}
                onChange={() => setTransUnit(!transUnit)}
              />
              <Switch
                checkedChildren="显示库存量"
                unCheckedChildren="隐藏库存量"
                value={showNum}
                onChange={() => setShowNum(!showNum)}
              />
              <Switch
                checkedChildren="游戏库存样式"
                unCheckedChildren="多行库存样式"
                value={original}
                onChange={() => setOriginal(!original)}
              />
              <Switch
                checkedChildren="显示数据标题"
                unCheckedChildren="隐藏数据标题"
                value={showTitle}
                onChange={() => setShowTitle(!showTitle)}
              />
              <Switch
                checkedChildren="使用特殊字体"
                unCheckedChildren="不用特殊字体"
                value={useFont}
                onChange={() => setUseFont(!useFont)}
              />
              <ColorPicker
                showText
                format="hex"
                value={color}
                onChange={(value) => setColor(value.toHexString())}
              />
              <ColorPicker
                showText
                format="hex"
                value={txtColor}
                onChange={(value) => setTxtColor(value.toHexString())}
              />

              <InputNumber
                placeholder="打折"
                value={discount}
                onChange={(value) => setDiscount(value)}
                suffix="x"
                changeOnWheel
                min={0}
                max={1}
              />
            </div>
          </Card>
        </>
      ),
    },
  ];
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { token } = theme.useToken();
  const [current, setCurrent] = React.useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  const contentStyle = {
    lineHeight: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  const props = {
    name: "file",
    showUploadList: false,
    beforeUpload: (file, fileList) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        var newData = JSON.parse(reader.result);
        newData = data.concat(newData);
        setData(removeDuplicates(newData));
      };
      return false; //cancel upload
    },
  };
  var [isBright, setIsBright] = React.useState(true);
  const { sitePv, pagePv, siteUv } = useVercount();

  return (
    <ConfigProvider theme={isBright ? {} : { algorithm: theme.darkAlgorithm }}>
      <Layout style={{ height: "100vh" }}>
        <Alert
          banner
          type="info"
          message={
            <Marquee pauseOnHover gradient={false}>
              {t("topWarn", { year: new Date().getFullYear() })}
            </Marquee>
          }
        />
        <Header
          style={{
            position: "sticky",
            top: "0px",
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            background: "#7da109",
          }}
        >
          <img src={logo} />
          <Title
            style={{
              margin: "auto 10px",
              color: colorBgContainer,
              textWrap: "nowrap",
            }}
          >
            RWRSG
          </Title>
          <div style={{ flex: 1 }} />
          <Switch
            checkedChildren={<SunOutlined />}
            unCheckedChildren={<MoonOutlined />}
            defaultChecked
            value={isBright}
            onChange={(value) => setIsBright(value)}
          />
        </Header>
        <Layout>
          <Sider
            width={210}
            style={{ background: colorBgContainer }}
            breakpoint="lg"
          >
            <Menu
              mode="inline"
              defaultOpenKeys={["1"]}
              style={{ height: "100%", borderInlineEnd: 0 }}
              items={navItem}
              onClick={(key) =>
                ["zh", "en"].indexOf(key["key"]) !== -1
                  ? i18n.changeLanguage(key["key"])
                  : ""
              }
            />
          </Sider>
          <div style={{ overflow: "auto", flex: "1" }} ref={ref5}>
            <Content style={{ padding: "16px 16px" }}>
              <div
                style={{
                  padding: 24,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <Spin
                          spinning={spinning}
                          indicator={<LoadingOutlined spin />}
                          size="large"
                        >
                          <Steps
                            current={current}
                            items={items}
                            onChange={(value) => {
                              setCurrent(value);
                            }}
                          />
                          <div style={contentStyle}>
                            {steps[current].content}
                          </div>
                          <div style={{ marginTop: 24 }}>
                            {current < steps.length - 1 && (
                              <Button
                                type="primary"
                                onClick={() => next()}
                                icon={<RightCircleFilled />}
                                ref={ref2}
                                style={{ marginRight: "8px" }}
                              >
                                {t("butNext")}
                              </Button>
                            )}
                            {current === steps.length - 1 && (
                              <>
                                <Button
                                  type="primary"
                                  icon={<DownloadOutlined />}
                                  style={{ marginBottom: "8px" }}
                                  onClick={() =>
                                    fs.saveAs(
                                      new Blob([JSON.stringify(data)], {
                                        type: "text/plain;charset=utf-8",
                                      }),
                                      "RWRSG-" + new Date().getTime() + ".json"
                                    )
                                  }
                                >
                                  保存数据
                                </Button>
                                <Button
                                  type="primary"
                                  style={{
                                    marginLeft: "8px",
                                    marginRight: "8px",
                                  }}
                                  icon={<DownloadOutlined />}
                                  onClick={() => {
                                    html2canvas(canvasRef.current).then(
                                      (canvas) => {
                                        canvas.toBlob((blob) => {
                                          if (blob) {
                                            // 使用FileSaver保存文件
                                            saveAs(
                                              blob,
                                              "RWRSG-" +
                                                new Date().getTime() +
                                                ".png"
                                            );
                                          }
                                        });
                                      }
                                    );
                                  }}
                                >
                                  保存图片
                                </Button>
                                <Button
                                  type="primary"
                                  style={{ marginRight: "8px" }}
                                  icon={<CopyOutlined />}
                                  onClick={() => {
                                    html2canvas(canvasRef.current).then(
                                      (canvas) => {
                                        canvas.toBlob((blob) => {
                                          if (blob) {
                                            try {
                                              const item = new ClipboardItem({
                                                "image/png": blob,
                                              });
                                              navigator.clipboard.write([item]);
                                              message.info(
                                                "已将图片复制至剪贴板"
                                              );
                                            } catch (error) {
                                              message.error(
                                                "复制至剪贴板失败：" + error
                                              );
                                            }
                                          }
                                        });
                                      }
                                    );
                                  }}
                                >
                                  {t("butCopyImg")}
                                </Button>
                              </>
                            )}
                            {current > 0 && (
                              <Button
                                onClick={() => prev()}
                                icon={<LeftCircleOutlined />}
                              >
                                {t("butPrevious")}
                              </Button>
                            )}
                            {current == 0 && (
                              <>
                                <Upload {...props}>
                                  <Button
                                    ref={ref1}
                                    style={{ marginRight: "8px" }}
                                    icon={<UploadOutlined />}
                                  >
                                    {t("butImport")}
                                  </Button>
                                </Upload>
                                {/* <Button
                                  icon={<QuestionCircleOutlined />}
                                  onClick={() => setOpen(true)}
                                  style={{ margin: "8px 0" }}
                                >
                                  导览帮助
                                </Button> */}
                              </>
                            )}
                          </div>
                        </Spin>
                      </>
                    }
                  />
                  <Route
                    path="/table"
                    element={
                      <>
                        <RwrTable />
                      </>
                    }
                  />
                  <Route
                    path="/*"
                    element={
                      <>
                        <Typography>什么都没有，3秒后返回首页</Typography>
                        <meta http-equiv="refresh" content="3;url=/" />
                      </>
                    }
                  />
                </Routes>
              </div>
            </Content>
            <Divider />
            <Typography style={{ width: "95%", padding: "20px" }}>
              {randomItem}
            </Typography>

            <Row justify="space-evenly">
              <Statistic.Timer
                type="countdown"
                title={t("countdown")}
                value={2064268800000}
                format="D day and H:m:s"
              />
              <Statistic.Timer
                type="countup"
                title={t("countup")}
                value={1755682690000}
                format="D day and H:m:s"
              />
            </Row>
            <Row justify="space-evenly">
              <Statistic
                value={siteUv}
                title={t("userCount")}
                formatter={formatter}
                prefix={<UserOutlined />}
              />
              <Statistic
                value={sitePv}
                title={t("siteCount")}
                formatter={formatter}
                prefix={<EyeOutlined />}
              />
              <Statistic
                value={pagePv}
                title={t("pageCount")}
                formatter={formatter}
                prefix={<FileTextOutlined />}
              />
            </Row>
            <a href="https://github.com/bananaxiao2333/rwrsg">
              <Row
                justify="space-evenly"
                style={{ margin: "20px 0", padding: "10px" }}
              >
                <img src="https://img.shields.io/github/contributors/bananaxiao2333/rwrsg" />
                <img src="https://img.shields.io/github/commit-activity/t/bananaxiao2333/rwrsg" />
                <img src="https://img.shields.io/github/actions/workflow/status/bananaxiao2333/rwrsg/.github%2Fworkflows%2Fghpage.yml" />
                <img src="https://img.shields.io/github/last-commit/bananaxiao2333/rwrsg" />
              </Row>
            </a>
            <div style={{ width: "100%", alignItems: "center" }}>
              {commitHistory ? (
                <Timeline
                  mode="alternate"
                  items={commitHistory}
                  style={{ width: "95%" }}
                />
              ) : (
                <div style={{ width: "100%", alignItems: "center" }}>
                  <Spin indicator={<GithubOutlined spin />} />
                </div>
              )}
            </div>
          </div>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
export default App;
