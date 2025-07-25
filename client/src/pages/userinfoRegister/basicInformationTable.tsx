import { defineComponent, ref, onMounted, computed } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElRadioGroup, ElRadio, ElTable, ElTableColumn, ElMessage, ElDatePicker, ElSelect, ElOption } from "element-plus";
import * as styles from "./styles.css.ts";
import { getUserProfile, submitUserProfile } from '@/api/postdoctor/userinfoRegister/bs_user_profile';
import AchievementForm from "./achievementForm.tsx";
import { Document, Paragraph, TextRun, Table, TableCell, TableRow, HeadingLevel, Packer } from "docx";
import { saveAs } from "file-saver";

// 引入 Pinia store
import { useAchievementStore } from "./store.ts";
export default defineComponent({
  name: "UserInfoForm",
  setup() {
    // 表单数据
    const form = ref({
      name: "",
      gender: "",
      birth_year: "",
      nationality: "",
      political_status: "",
      phone: "",
      religion: "",
      id_number: "",
      is_religious_staff: "",
      research_direction: "",
      education_experience: [
        { start: "", end: "", school: "", major: "", supervisor: "" }
      ],
      work_experience: [
        { start: "", end: "", company: "", position: "" }
      ],
      other: "",
      otherachievements: ""
    });

    // 表单校验规则
    const rules = {
      name: [
        { required: false, message: "请输入姓名", trigger: "blur" },
        { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: "姓名只能包含中文或英文字符", trigger: "blur" },
      ],
      birth_year: [
        { required: false, message: "请输入出生年", trigger: "blur" },
        { pattern: /^(19|20)\d{2}$/, message: "请输入有效的年份（1900-2099）", trigger: "blur" },
      ],
      nationality: [
        { required: false, message: "请输入国籍", trigger: "blur" },
        { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: "国籍只能包含中文或英文字符", trigger: "blur" },
      ],
      id_number: [
        { required: true, message: "请输入身份证号", trigger: "blur" },
        { pattern: /^[1-9]\d{5}(18|19|20|21)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/, message: "请输入有效的身份证号", trigger: "blur" },
      ],
      phone: [
        { required: false, message: "请输入电话号码", trigger: "blur" },
        { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号码", trigger: "blur" },
      ],
    };

    // 加载用户信息
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        console.log('111');
        if (data) {
          form.value = {
            ...form.value,
            ...data,
            name: data.name ?? "",
            gender: data.gender ?? "",
            birth_year: data.birth_year ? String(data.birth_year) : "",
            nationality: data.nationality ?? "",
            political_status: data.political_status ?? "",
            phone: data.phone ?? "",
            religion: data.religion ?? "",
            id_number: data.id_number ?? "",
            is_religious_staff: data.is_religious_staff ? "是" : "否",
            research_direction: data.research_direction ?? "",
            other: data.other ?? "",
            otherachievements: data.otherachievements ?? "",
            education_experience: (data.education_experience || []).map((e: any) => {
              // 匹配两个日期（YYYY-MM-DD-YYYY-MM-DD）
              const match = (e.start_end || "").match(/^(.{10})-(.{10})$/);
              return {
                start: match ? match[1] : "",
                end: match ? match[2] : "",
                school: e.school_major ?? "",
                major: "",
                supervisor: e.supervisor ?? ""
              };
            }),
            work_experience: (data.work_experience || []).map((w: any) => {
              const match = (w.start_end || "").match(/^(.{10})-(.{10})$/);
              return {
                start: match ? match[1] : "",
                end: match ? match[2] : "",
                company: w.company_position ?? "",
                position: ""
              };
            })
          };
        }
      } catch (e: any) {
        // 未查到信息时不报错
      }
    };

    // 页面挂载时获取用户信息
    onMounted(fetchProfile);

    // 获取store中的成就统计数据
    const achievementStore = useAchievementStore();
    const totalAchievements = computed(() => achievementStore.getTotalAchievements());

    // 教育经历操作
    const addEducation = () => {
      form.value.education_experience.push({ start: "", end: "", school: "", major: "", supervisor: "" });
    };
    const removeEducation = (index: number) => {
      form.value.education_experience.splice(index, 1);
    };
    // 工作经历操作
    const addWork = () => {
      form.value.work_experience.push({ start: "", end: "", company: "", position: "" });
    };
    const removeWork = (index: number) => {
      form.value.work_experience.splice(index, 1);
    };
    // 提交
    const handleSubmit = async () => {
      // 数据格式转换
      const payload = {
        ...form.value,
        birth_year: form.value.birth_year ? Number(form.value.birth_year) : undefined,
        is_religious_staff: form.value.is_religious_staff === '是',
        education_experience: form.value.education_experience.map(e => ({
          start_end: `${e.start}-${e.end}`,
          school_major: e.school,
          supervisor: e.supervisor || ""
        })),
        work_experience: form.value.work_experience.map(w => ({
          start_end: `${w.start}-${w.end}`,
          company_position: w.company
        }))
      };
      try {
        await submitUserProfile(payload);
        ElMessage.success('保存成功！');
        fetchProfile();
      } catch (e: any) {
        ElMessage.error(e?.message || '保存失败');
      }
    };

    // 导出
    const handleExport = async () => {
      try {
        // 创建文档
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                heading: HeadingLevel.HEADING_1,
                children: [new TextRun("基本信息表")]
              }),
              // 基本信息表格
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("姓名")] }),
                      new TableCell({ children: [new Paragraph(form.value.name || "")] }),
                      new TableCell({ children: [new Paragraph("性别")] }),
                      new TableCell({ children: [new Paragraph(form.value.gender || "")] })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("出生年")] }),
                      new TableCell({ children: [new Paragraph(form.value.birth_year || "")] }),
                      new TableCell({ children: [new Paragraph("国籍")] }),
                      new TableCell({ children: [new Paragraph(form.value.nationality || "")] })
                    ]
                  }),
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("政治面貌")] }),
                      new TableCell({ children: [new Paragraph(form.value.political_status || "")] }),
                      new TableCell({ children: [new Paragraph("电话")] }),
                      new TableCell({ children: [new Paragraph(form.value.phone || "")] })
                    ]
                  })
                ]
              }),
              
              new Paragraph({
                heading: HeadingLevel.HEADING_2,
                text: "教育经历",
                spacing: { before: 400 }
              }),
              
              // 教育经历表格
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("起止时间")] }),
                      new TableCell({ children: [new Paragraph("学校")] }),
                      new TableCell({ children: [new Paragraph("证明人")] })
                    ]
                  }),
                  ...form.value.education_experience.map(edu => 
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(`${edu.start || ''} - ${edu.end || ''}`)] }),
                        new TableCell({ children: [new Paragraph(edu.school || '')] }),
                        new TableCell({ children: [new Paragraph(edu.supervisor || '')] })
                      ]
                    })
                  )
                ]
              }),

              new Paragraph({
                heading: HeadingLevel.HEADING_2,
                text: "工作经历",
                spacing: { before: 400 }
              }),
              
              // 工作经历表格
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("起止时间")] }),
                      new TableCell({ children: [new Paragraph("单位及职务")] })
                    ]
                  }),
                  ...form.value.work_experience.map(work => 
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(`${work.start || ''} - ${work.end || ''}`)] }),
                        new TableCell({ children: [new Paragraph(work.company || '')] })
                      ]
                    })
                  )
                ]
              }),

              new Paragraph({
                text: "研究方向",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400 }
              }),
              new Paragraph(form.value.research_direction || ""),

              new Paragraph({
                text: "其他说明",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400 }
              }),
              new Paragraph(form.value.other || ""),

              new Paragraph({
                text: "论文发表情况",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400 }
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("论文名称")] }),
                      new TableCell({ children: [new Paragraph("刊物名称")] }),
                      new TableCell({ children: [new Paragraph("发表日期")] }),
                      new TableCell({ children: [new Paragraph("本人署名排序")] }),
                      new TableCell({ children: [new Paragraph("起始页号")] }),
                      new TableCell({ children: [new Paragraph("刊物级别")] }),
                      new TableCell({ children: [new Paragraph("是否共同第一")] }),
                      new TableCell({ children: [new Paragraph("通讯作者")] }),
                      new TableCell({ children: [new Paragraph("论文类型")] }),
                      new TableCell({ children: [new Paragraph("影响因子")] }),
                      new TableCell({ children: [new Paragraph("作者名单")] }),
                      new TableCell({ children: [new Paragraph("第一作者")] }),
                      new TableCell({ children: [new Paragraph("导师署名排序")] }),
                      new TableCell({ children: [new Paragraph("本校是否第一")] }),
                      new TableCell({ children: [new Paragraph("第一署名单位")] }),
                      new TableCell({ children: [new Paragraph("发表状态")] }),
                      new TableCell({ children: [new Paragraph("论文收录检索")] }),
                      new TableCell({ children: [new Paragraph("他引次数")] }),
                      new TableCell({ children: [new Paragraph("是否和学位论文相关")] }),
                      new TableCell({ children: [new Paragraph("出版号")] }),
                      new TableCell({ children: [new Paragraph("出版社")] }),
                      new TableCell({ children: [new Paragraph("总期号")] }),
                      new TableCell({ children: [new Paragraph("刊物编号")] }),
                      new TableCell({ children: [new Paragraph("备注")] })
                    ]
                  }),
                  ...(achievementStore.paperList || []).map(paper => 
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(paper.论文名称 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.刊物名称 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.发表日期 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.本人署名排序 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.起始页号 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.刊物级别 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.是否共同第一 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.通讯作者 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.论文类型 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.影响因子 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.作者名单 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.第一作者 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.导师署名排序 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.本校是否第一 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.第一署名单位 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.发表状态 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.论文收录检索 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.他引次数 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.是否和学位论文相关 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.出版号 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.出版社 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.总期号 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.刊物编号 || '')] }),
                        new TableCell({ children: [new Paragraph(paper.备注 || '')] })
                      ]
                    })
                  )
                ]
              }),

              new Paragraph({
                text: "专利信息",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400 }
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("专利名称")] }),
                      new TableCell({ children: [new Paragraph("专利类型")] }),
                      new TableCell({ children: [new Paragraph("申请日期")] }),
                      new TableCell({ children: [new Paragraph("授权日期")] }),
                      new TableCell({ children: [new Paragraph("专利号")] }),
                      new TableCell({ children: [new Paragraph("申请号")] }),
                      new TableCell({ children: [new Paragraph("发明人")] }),
                      new TableCell({ children: [new Paragraph("专利权人")] }),
                      new TableCell({ children: [new Paragraph("专利状态")] }),
                      new TableCell({ children: [new Paragraph("备注")] })
                    ]
                  }),
                  ...(achievementStore.patentList || []).map(patent => 
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(patent.专利成果名称 || '')] }),
                        new TableCell({ children: [new Paragraph(patent.专利类型 || '')] }),
                        new TableCell({ children: [new Paragraph(patent.提交时间 || '')] }),
                        new TableCell({ children: [new Paragraph(patent.批准日期 || '')] }),
                        new TableCell({ children: [new Paragraph(patent.授权公告号 || '')] }),
                        new TableCell({ children: [new Paragraph(patent.申请编号 || '')] }),
                        new TableCell({ children: [new Paragraph(patent.作者排名 || '')] }),
                        new TableCell({ children: [new Paragraph(patent.专利权人 || '')] }),
                        new TableCell({ children: [new Paragraph(patent.专利成果编码 || '')] }),
                        new TableCell({ children: [new Paragraph(patent.备注 || '')] })
                      ]
                    })
                  )
                ]
              }),

              new Paragraph({
                text: "科技竞赛获奖情况",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400 }
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("竞赛名称")] }),
                      new TableCell({ children: [new Paragraph("获奖类别")] }),
                      new TableCell({ children: [new Paragraph("获奖等级")] }),
                      new TableCell({ children: [new Paragraph("获奖时间")] }),
                      new TableCell({ children: [new Paragraph("本人署名")] }),
                      new TableCell({ children: [new Paragraph("获奖级别")] }),
                      new TableCell({ children: [new Paragraph("颁奖单位")] }),
                      new TableCell({ children: [new Paragraph("第一完成单位")] }),
                      new TableCell({ children: [new Paragraph("完成单位排名")] }),
                      new TableCell({ children: [new Paragraph("是否和学位论文相关")] }),
                      new TableCell({ children: [new Paragraph("奖项名称")] }),
                      new TableCell({ children: [new Paragraph("作者名单")] }),
                      new TableCell({ children: [new Paragraph("备注")] })
                    ]
                  }),
                  ...(achievementStore.awardList || []).map(award => 
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(award.竞赛名称 || '')] }),
                        new TableCell({ children: [new Paragraph(award.获奖类别 || '')] }),
                        new TableCell({ children: [new Paragraph(award.获奖等级 || '')] }),
                        new TableCell({ children: [new Paragraph(award.获奖时间 || '')] }),
                        new TableCell({ children: [new Paragraph(award.本人署名 || '')] }),
                        new TableCell({ children: [new Paragraph(award.获奖级别 || '')] }),
                        new TableCell({ children: [new Paragraph(award.颁奖单位 || '')] }),
                        new TableCell({ children: [new Paragraph(award.第一完成单位 || '')] }),
                        new TableCell({ children: [new Paragraph(award.完成单位排名 || '')] }),
                        new TableCell({ children: [new Paragraph(award.是否和学位论文相关 || '')] }),
                        new TableCell({ children: [new Paragraph(award.奖项名称 || '')] }),
                        new TableCell({ children: [new Paragraph(award.作者名单 || '')] }),
                        new TableCell({ children: [new Paragraph(award.备注 || '')] })
                      ]
                    })
                  )
                ]
              }),

              new Paragraph({
                text: "参与项目情况",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400 }
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("项目编号")] }),
                      new TableCell({ children: [new Paragraph("项目名称")] }),
                      new TableCell({ children: [new Paragraph("项目类型")] }),
                      new TableCell({ children: [new Paragraph("是否和学位论文相关")] }),
                      new TableCell({ children: [new Paragraph("项目标题")] }),
                      new TableCell({ children: [new Paragraph("立项日期")] }),
                      new TableCell({ children: [new Paragraph("项目层次")] }),
                      new TableCell({ children: [new Paragraph("参与人排名")] }),
                      new TableCell({ children: [new Paragraph("项目负责人")] }),
                      new TableCell({ children: [new Paragraph("本人承担部分")] }),
                      new TableCell({ children: [new Paragraph("项目来源")] }),
                      new TableCell({ children: [new Paragraph("其他资助情况")] }),
                      new TableCell({ children: [new Paragraph("备注")] })
                    ]
                  }),
                  ...(achievementStore.projectList || []).map(project => 
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(project.项目编号 || '')] }),
                        new TableCell({ children: [new Paragraph(project.项目名称 || '')] }),
                        new TableCell({ children: [new Paragraph(project.项目类型 || '')] }),
                        new TableCell({ children: [new Paragraph(project.是否和学位论文相关 || '')] }),
                        new TableCell({ children: [new Paragraph(project.项目标题 || '')] }),
                        new TableCell({ children: [new Paragraph(project.立项日期 || '')] }),
                        new TableCell({ children: [new Paragraph(project.项目层次 || '')] }),
                        new TableCell({ children: [new Paragraph(project.参与人排名 || '')] }),
                        new TableCell({ children: [new Paragraph(project.项目负责人 || '')] }),
                        new TableCell({ children: [new Paragraph(project.本人承担部分 || '')] }),
                        new TableCell({ children: [new Paragraph(project.项目来源 || '')] }),
                        new TableCell({ children: [new Paragraph(project.其他资助情况 || '')] }),
                        new TableCell({ children: [new Paragraph(project.备注 || '')] })
                      ]
                    })
                  )
                ]
              }),

              new Paragraph({
                text: "学术会议情况",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400 }
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("会议编号")] }),
                      new TableCell({ children: [new Paragraph("会议名称")] }),
                      new TableCell({ children: [new Paragraph("会议英文名")] }),
                      new TableCell({ children: [new Paragraph("主办单位")] }),
                      new TableCell({ children: [new Paragraph("会议举办形式")] }),
                      new TableCell({ children: [new Paragraph("会议等级")] }),
                      new TableCell({ children: [new Paragraph("国家或地区")] }),
                      new TableCell({ children: [new Paragraph("是否境外")] }),
                      new TableCell({ children: [new Paragraph("会议起始日")] }),
                      new TableCell({ children: [new Paragraph("会议终止日")] }),
                      new TableCell({ children: [new Paragraph("举办单位")] }),
                      new TableCell({ children: [new Paragraph("会议人数")] }),
                      new TableCell({ children: [new Paragraph("联系人电话")] }),
                      new TableCell({ children: [new Paragraph("会议地点")] }),
                      new TableCell({ children: [new Paragraph("会议报告")] }),
                      new TableCell({ children: [new Paragraph("备注")] })
                    ]
                  }),
                  ...(achievementStore.conferenceList || []).map(conf => 
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(conf.会议编号 || '')] }),
                        new TableCell({ children: [new Paragraph(conf.会议名称 || '')] }),
                        new TableCell({ children: [new Paragraph(conf.会议英文名 || '')] }),
                        new TableCell({ children: [new Paragraph(conf.主办单位 || '')] }),
                        new TableCell({ children: [new Paragraph(conf.会议举办形式 || '')] }),
                        new TableCell({ children: [new Paragraph(conf.会议等级 || '')] }),
                        new TableCell({ children: [new Paragraph(conf.国家或地区 || '')] }),
                        new TableCell({ children: [new Paragraph(conf.是否境外 || '')] }),
                        new TableCell({ children: [new Paragraph(conf.会议起始日 || '')] }),
                        new TableCell({ children: [new Paragraph(conf.会议终止日 || '')] }),
                        new TableCell({ children: [new Paragraph(conf.举办单位 || '')] }),
                        new TableCell({ children: [new Paragraph(conf.会议人数 || '')] }),
                        new TableCell({ children: [new Paragraph(conf.联系人电话 || '')] }),
                        new TableCell({ children: [new Paragraph(conf.会议地点 || '')] }),
                        new TableCell({ children: [new Paragraph(conf.会议报告 || '')] }),
                        new TableCell({ children: [new Paragraph(conf.备注 || '')] })
                      ]
                    })
                  )
                ]
              }),

              new Paragraph({
                text: "著作信息",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400 }
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("著作编号")] }),
                      new TableCell({ children: [new Paragraph("序号")] }),
                      new TableCell({ children: [new Paragraph("著作名")] }),
                      new TableCell({ children: [new Paragraph("丛书名")] }),
                      new TableCell({ children: [new Paragraph("出版社")] }),
                      new TableCell({ children: [new Paragraph("出版地")] }),
                      new TableCell({ children: [new Paragraph("出版日期")] }),
                      new TableCell({ children: [new Paragraph("ISBN")] }),
                      new TableCell({ children: [new Paragraph("字数(万字)")] }),
                      new TableCell({ children: [new Paragraph("第一作者")] }),
                      new TableCell({ children: [new Paragraph("本人是否第一作者")] }),
                      new TableCell({ children: [new Paragraph("本人排名")] }),
                      new TableCell({ children: [new Paragraph("共同作者")] }),
                      new TableCell({ children: [new Paragraph("书号")] }),
                      new TableCell({ children: [new Paragraph("语种")] }),
                      new TableCell({ children: [new Paragraph("所属二级学科代码")] }),
                      new TableCell({ children: [new Paragraph("备注")] })
                    ]
                  }),
                  ...(achievementStore.bookList || []).map(book => 
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(book.著作编号 || '')] }),
                        new TableCell({ children: [new Paragraph(book.序号 || '')] }),
                        new TableCell({ children: [new Paragraph(book.著作名 || '')] }),
                        new TableCell({ children: [new Paragraph(book.丛书名 || '')] }),
                        new TableCell({ children: [new Paragraph(book.出版社 || '')] }),
                        new TableCell({ children: [new Paragraph(book.出版地 || '')] }),
                        new TableCell({ children: [new Paragraph(book.出版日期 || '')] }),
                        new TableCell({ children: [new Paragraph(book.ISBN || '')] }),
                        new TableCell({ children: [new Paragraph(book['字数(万字)'] || '')] }),
                        new TableCell({ children: [new Paragraph(book.第一作者 || '')] }),
                        new TableCell({ children: [new Paragraph(book.本人是否第一作者 || '')] }),
                        new TableCell({ children: [new Paragraph(book.本人排名 || '')] }),
                        new TableCell({ children: [new Paragraph(book.共同作者 || '')] }),
                        new TableCell({ children: [new Paragraph(book.书号 || '')] }),
                        new TableCell({ children: [new Paragraph(book.语种 || '')] }),
                        new TableCell({ children: [new Paragraph(book.所属二级学科代码 || '')] }),
                        new TableCell({ children: [new Paragraph(book.备注 || '')] })
                      ]
                    })
                  )
                ]
              }),

              new Paragraph({
                text: "行业标准制定",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400 }
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("标准编号")] }),
                      new TableCell({ children: [new Paragraph("序号")] }),
                      new TableCell({ children: [new Paragraph("标准名称")] }),
                      new TableCell({ children: [new Paragraph("起草者")] }),
                      new TableCell({ children: [new Paragraph("本人是否第一起草者")] }),
                      new TableCell({ children: [new Paragraph("本人排名")] }),
                      new TableCell({ children: [new Paragraph("共同起草者")] }),
                      new TableCell({ children: [new Paragraph("标准级别")] }),
                      new TableCell({ children: [new Paragraph("发布日期")] }),
                      new TableCell({ children: [new Paragraph("实施日期")] }),
                      new TableCell({ children: [new Paragraph("发布机构")] }),
                      new TableCell({ children: [new Paragraph("标准号")] }),
                      new TableCell({ children: [new Paragraph("备注")] })
                    ]
                  }),
                  ...(achievementStore.standardList || []).map(standard => 
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(standard.标准编号 || '')] }),
                        new TableCell({ children: [new Paragraph(standard.序号 || '')] }),
                        new TableCell({ children: [new Paragraph(standard.标准名称 || '')] }),
                        new TableCell({ children: [new Paragraph(standard.起草者 || '')] }),
                        new TableCell({ children: [new Paragraph(standard.本人是否第一起草者 || '')] }),
                        new TableCell({ children: [new Paragraph(standard.本人排名 || '')] }),
                        new TableCell({ children: [new Paragraph(standard.共同起草者 || '')] }),
                        new TableCell({ children: [new Paragraph(standard.标准级别 || '')] }),
                        new TableCell({ children: [new Paragraph(standard.发布日期 || '')] }),
                        new TableCell({ children: [new Paragraph(standard.实施日期 || '')] }),
                        new TableCell({ children: [new Paragraph(standard.发布机构 || '')] }),
                        new TableCell({ children: [new Paragraph(standard.标准号 || '')] }),
                        new TableCell({ children: [new Paragraph(standard.备注 || '')] })
                      ]
                    })
                  )
                ]
              }),

              new Paragraph({
                text: "新品种培育",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400 }
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("品种编号")] }),
                      new TableCell({ children: [new Paragraph("序号")] }),
                      new TableCell({ children: [new Paragraph("品种名称")] }),
                      new TableCell({ children: [new Paragraph("品种种类")] }),
                      new TableCell({ children: [new Paragraph("自主培育")] }),
                      new TableCell({ children: [new Paragraph("第一育种者")] }),
                      new TableCell({ children: [new Paragraph("本人是否第一育种者")] }),
                      new TableCell({ children: [new Paragraph("本人排名")] }),
                      new TableCell({ children: [new Paragraph("共同选育者")] }),
                      new TableCell({ children: [new Paragraph("登记年份")] }),
                      new TableCell({ children: [new Paragraph("公示年份")] }),
                      new TableCell({ children: [new Paragraph("登记状态")] }),
                      new TableCell({ children: [new Paragraph("登记编号")] }),
                      new TableCell({ children: [new Paragraph("选育单位")] }),
                      new TableCell({ children: [new Paragraph("备注")] })
                    ]
                  }),
                  ...(achievementStore.varietyList || []).map(variety => 
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(variety.品种编号 || '')] }),
                        new TableCell({ children: [new Paragraph(variety.序号 || '')] }),
                        new TableCell({ children: [new Paragraph(variety.品种名称 || '')] }),
                        new TableCell({ children: [new Paragraph(variety.品种种类 || '')] }),
                        new TableCell({ children: [new Paragraph(variety.自主培育 || '')] }),
                        new TableCell({ children: [new Paragraph(variety.第一育种者 || '')] }),
                        new TableCell({ children: [new Paragraph(variety.本人是否第一育种者 || '')] }),
                        new TableCell({ children: [new Paragraph(variety.本人排名 || '')] }),
                        new TableCell({ children: [new Paragraph(variety.共同选育者 || '')] }),
                        new TableCell({ children: [new Paragraph(variety.登记年份 || '')] }),
                        new TableCell({ children: [new Paragraph(variety.公示年份 || '')] }),
                        new TableCell({ children: [new Paragraph(variety.登记状态 || '')] }),
                        new TableCell({ children: [new Paragraph(variety.登记编号 || '')] }),
                        new TableCell({ children: [new Paragraph(variety.选育单位 || '')] }),
                        new TableCell({ children: [new Paragraph(variety.备注 || '')] })
                      ]
                    })
                  )
                ]
              }),

              new Paragraph({
                text: "课题研究信息",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400 }
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph("课题编号")] }),
                      new TableCell({ children: [new Paragraph("序号")] }),
                      new TableCell({ children: [new Paragraph("课题名称")] }),
                      new TableCell({ children: [new Paragraph("课题负责人")] }),
                      new TableCell({ children: [new Paragraph("本人是否负责人")] }),
                      new TableCell({ children: [new Paragraph("承担角色")] }),
                      new TableCell({ children: [new Paragraph("课题来源")] }),
                      new TableCell({ children: [new Paragraph("课题级别")] }),
                      new TableCell({ children: [new Paragraph("立项年份")] }),
                      new TableCell({ children: [new Paragraph("结题年份")] }),
                      new TableCell({ children: [new Paragraph("课题经费(万元)")] }),
                      new TableCell({ children: [new Paragraph("立项单位")] }),
                      new TableCell({ children: [new Paragraph("参加单位")] }),
                      new TableCell({ children: [new Paragraph("参加人员")] }),
                      new TableCell({ children: [new Paragraph("实施形式")] }),
                      new TableCell({ children: [new Paragraph("备注")] })
                    ]
                  }),
                  ...(achievementStore.subjectResearchList || []).map(research => 
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph(research.课题编号 || '')] }),
                        new TableCell({ children: [new Paragraph(research.序号 || '')] }),
                        new TableCell({ children: [new Paragraph(research.课题名称 || '')] }),
                        new TableCell({ children: [new Paragraph(research.课题负责人 || '')] }),
                        new TableCell({ children: [new Paragraph(research.本人是否负责人 || '')] }),
                        new TableCell({ children: [new Paragraph(research.承担角色 || '')] }),
                        new TableCell({ children: [new Paragraph(research.课题来源 || '')] }),
                        new TableCell({ children: [new Paragraph(research.课题级别 || '')] }),
                        new TableCell({ children: [new Paragraph(research.立项年份 || '')] }),
                        new TableCell({ children: [new Paragraph(research.结题年份 || '')] }),
                        new TableCell({ children: [new Paragraph(research['课题经费(万元)'] || '')] }),
                        new TableCell({ children: [new Paragraph(research.立项单位 || '')] }),
                        new TableCell({ children: [new Paragraph(research.参加单位 || '')] }),
                        new TableCell({ children: [new Paragraph(research.参加人员 || '')] }),
                        new TableCell({ children: [new Paragraph(research.实施形式 || '')] }),
                        new TableCell({ children: [new Paragraph(research.备注 || '')] })
                      ]
                    })
                  )
                ]
              }),

              new Paragraph({
                text: "其他成果",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400 }
              }),
              new Paragraph(form.value.otherachievements || "")
            ]
          }]
        });

        // 生成文档
        const blob = await Packer.toBlob(doc);
        saveAs(blob, "个人信息导出.docx");
        ElMessage.success("导出成功");
      } catch (error) {
        console.error("导出失败", error);
        ElMessage.error("导出失败：" + ((error as Error).message || "未知错误"));
      }
    };

    return () => (
      <div class={styles.formWrapper}>
        <div style={{ fontSize: '1.5em', fontWeight: 700, textAlign: 'left', marginBottom: '1em', letterSpacing: '0.05em' }}>基本信息表</div>
        <ElForm model={form.value} rules={rules} labelWidth="100px">
          {/* 基本信息两列 */}
          <div class={styles.formRow}>
            <div class={styles.formCol}>
              <ElFormItem label="姓名" prop="name">
                <ElInput v-model={form.value.name} />
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="性别" prop="gender">
                <ElSelect v-model={form.value.gender} placeholder="请选择性别" style={{ width: "100%" }} clearable>
                  <ElOption label="男" value="男" />
                  <ElOption label="女" value="女" />
                </ElSelect>
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="出生年" prop="birth_year">
                <ElInput v-model={form.value.birth_year} />
              </ElFormItem>
            </div>
          </div>
          <div class={styles.formRow}>
            <div class={styles.formCol}>
              <ElFormItem label="国籍" prop="nationality">
                <ElInput v-model={form.value.nationality} />
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="政治面貌" prop="political_status">
                <ElSelect v-model={form.value.political_status} placeholder="请选择政治面貌" style={{ width: "100%" }} clearable>
                  <ElOption label="中共党员" value="中共党员" />
                  <ElOption label="中共预备党员" value="中共预备党员" />
                  <ElOption label="共青团员" value="共青团员" />
                  <ElOption label="民革党员" value="民革党员" />
                  <ElOption label="民盟盟员" value="民盟盟员" />
                  <ElOption label="民建会员" value="民建会员" />
                  <ElOption label="民进会员" value="民进会员" />
                  <ElOption label="农工党党员" value="农工党党员" />
                  <ElOption label="致公党党员" value="致公党党员" />
                  <ElOption label="九三学社社员" value="九三学社社员" />
                  <ElOption label="台盟盟员" value="台盟盟员" />
                  <ElOption label="无党派人士" value="无党派人士" />
                  <ElOption label="群众" value="群众" />
                </ElSelect>
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="电话" prop="phone">
                <ElInput v-model={form.value.phone} />
              </ElFormItem>
            </div>
          </div>
          <div class={styles.formRow}>
            <div class={styles.formCol}>
              <ElFormItem label="宗教信仰" prop="religion">
                <ElSelect v-model={form.value.religion} placeholder="请选择宗教信仰" style={{ width: "100%" }} clearable>
                  <ElOption label="佛教" value="佛教" />
                  <ElOption label="道教" value="道教" />
                  <ElOption label="伊斯兰教" value="伊斯兰教" />
                  <ElOption label="天主教" value="天主教" />
                  <ElOption label="基督教" value="基督教" />
                  <ElOption label="其他" value="其他" />
                </ElSelect>
              </ElFormItem>
            </div>
            <div class={styles.formCol} >
              <ElFormItem label="证件号" prop="id_number">
                <ElInput v-model={form.value.id_number} />
              </ElFormItem>
            </div>
            <div class={styles.formCol}>
              <ElFormItem label="宗教教职人员">
                <ElRadioGroup v-model={form.value.is_religious_staff}>
                  <ElRadio label="是">是</ElRadio>
                  <ElRadio label="否">否</ElRadio>
                </ElRadioGroup>
              </ElFormItem>
            </div>
          </div>
          <ElFormItem label="博士期间研究方向" prop="research_direction">
            <ElInput
              v-model={form.value.research_direction}
              type="textarea"
              rows={2}
              maxlength="100"
              show-word-limit
              placeholder="请输入博士期间研究方向（最多100字）"
            />
          </ElFormItem>
          {/* 教育经历表格 */}
          <div style={{ fontWeight: 700, fontSize: '1.1em', margin: '1.5em 0 0.5em 0' }}>
            教育经历 <span style={{ fontWeight: 400, fontSize: '0.95em' }}>(从高中填起，请勿间断)</span>
          </div>
          <ElFormItem label="">
            <ElTable data={form.value.education_experience} class={styles.table} style={{ width: "100%" }}>
              <ElTableColumn label="起止时间">
                {{
                  default: ({ row }: any) => (
                    <>
                      <ElDatePicker
                        v-model={row.start}
                        type="date"
                        placeholder="起"
                        style={{ width: '120px' }}
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                      />
                      <span> - </span>
                      <ElDatePicker
                        v-model={row.end}
                        type="date"
                        placeholder="止"
                        style={{ width: '120px' }}
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                      />
                    </>
                  )
                }}
              </ElTableColumn>
              <ElTableColumn label="毕业学校及专业">
                {{
                  default: ({ row }: any) => (
                    <ElInput v-model={row.school} placeholder="毕业学校及专业" style={{ width: "220px" }} />
                  )
                }}
              </ElTableColumn>
              <ElTableColumn label="证明人">
                {{
                  default: ({ row }: any) => (
                    <ElInput v-model={row.supervisor} placeholder="证明人" style={{ width: "100px" }} />
                  )
                }}
              </ElTableColumn>
              <ElTableColumn label="操作">
                {{
                  default: ({ $index }: any) => (
                    <ElButton type="danger" size="small" onClick={() => removeEducation($index)}>删除</ElButton>
                  )
                }}
              </ElTableColumn>
            </ElTable>
            <ElButton type="primary" size="small" onClick={addEducation} style={{ marginTop: "8px" }}>添加教育经历</ElButton>
          </ElFormItem>
          {/* 工作经历表格 */}
          <div style={{ fontWeight: 700, fontSize: '1.1em', margin: '1.5em 0 0.5em 0' }}>
            工作经历 <span style={{ fontWeight: 400, fontSize: '0.95em' }}>(含博士后经历，请勿间断)</span>
          </div>
          <ElFormItem label=" ">
            <ElTable data={form.value.work_experience} class={styles.table} style={{ width: "100%" }}>
              <ElTableColumn label="起止时间">
                {{
                  default: ({ row }: any) => (
                    <>
                      <ElDatePicker
                        v-model={row.start}
                        type="date"
                        placeholder="起"
                        style={{ width: '120px' }}
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                      />
                      <span> - </span>
                      <ElDatePicker
                        v-model={row.end}
                        type="date"
                        placeholder="止"
                        style={{ width: '120px' }}
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                      />
                    </>
                  )
                }}
              </ElTableColumn>
              <ElTableColumn label="工作单位及职务">
                {{
                  default: ({ row }: any) => (
                    <ElInput v-model={row.company} placeholder="工作单位及职务" style={{ width: "220px" }} />
                  )
                }}
              </ElTableColumn>
              <ElTableColumn label="操作">
                {{
                  default: ({ $index }: any) => (
                    <ElButton type="danger" size="small" onClick={() => removeWork($index)}>删除</ElButton>
                  )
                }}
              </ElTableColumn>
            </ElTable>
            <ElButton type="primary" size="small" onClick={addWork} style={{ marginTop: "8px" }}>添加工作经历</ElButton>
          </ElFormItem>
          {/* 其他说明 */}
          <ElFormItem label="其他说明">
            <ElInput v-model={form.value.other} type="textarea" rows={2} maxlength="100" show-word-limit placeholder="是否有亲属在本工作（姓名和亲属关系），何时何地受过何种处分或者被追究刑事责任" />
          </ElFormItem>
          <AchievementForm />
          {/* 其他成果 */}
          <ElFormItem label="其他成果" prop="otherachievements">
            <ElInput v-model={form.value.otherachievements} type="textarea" rows={2} maxlength="100" show-word-limit placeholder="其他成果" />
          </ElFormItem>
          {/* 累计成果个数 */}
          <div style={{ margin: '2em 0 1em 0', fontWeight: 700 }}>累计成果个数：{totalAchievements.value}</div>
          {/* 按钮组 */}
          <div class={styles.btnGroup}>
            <ElButton type="primary" onClick={handleSubmit}>提交</ElButton>
            <ElButton type="warning" onClick={handleExport}>导出</ElButton>
            <ElButton type="warning">返回</ElButton>
          </div>
        </ElForm>
        </div>
    );
  }
});

