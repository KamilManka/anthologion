import React from "react";
import { useState, useEffect } from "react";
import GreatEktenia from "./GreatEktenia";
import LittleEktenia from "./LittleEktenia";
import { supabase } from "./supabaseClient";
import {
  Switch,
  Space,
  DatePicker,
  Dropdown,
  MenuProps,
  ConfigProvider,
} from "antd";
import RegularInitialPrayers from "./RegularInitialPrayers";
import { SettingOutlined, SettingTwoTone } from "@ant-design/icons";
import { RiSettings4Fill } from "react-icons/ri";
import plPL from "antd/locale/pl_PL";
import dayjs from "dayjs";
import "dayjs/locale/pl";
import Psalm103 from "./Psalm103";
import LordICried from "./LordICried";
import SettingsIcon from "./SettingsIcon";
dayjs.locale("pl-pl");

const Vespers = () => {
  let [stichera, setStichera] = useState([]);
  let [aposticha, setAposticha] = useState([]);
  let [prokeimenon, setProkeimenon] = useState([]);
  const [readerView, setReaderView] = useState();
  let [troparia, setTroparia] = useState([]);
  let [date, setDate] = useState(new Date());
  const [openDropdown, setOpenDropdown] = useState(false);
  const locale = plPL;
  function getWeeksDiff(startDate, endDate) {
    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil(Math.abs(endDate - startDate) / msInWeek);
  }

  console.log(
    getWeeksDiff(
      new Date("2022-06-26"),
      new Date(date.toISOString().slice(0, 10))
    )
  );

  let weeksDiff = getWeeksDiff(
    new Date("2022-06-24"),
    new Date(date.toISOString().slice(0, 10))
  );

  let lentWeeksDiff = getWeeksDiff(
    new Date(date.toISOString().slice(0, 10)),
    new Date("2023-04-16")
  );
  console.log(lentWeeksDiff);

  const getOctoechosTone = (weeksDiff) => {
    let toneNum = 0;
    if (weeksDiff % 8 === 0) {
      toneNum = 8;
    } else {
      toneNum = Math.ceil(weeksDiff % 8);
    }

    return toneNum;
  };

  const getStichos = async (tone, day, isAposticha) => {
    let table;
    if (lentWeeksDiff > 10) {
      table = "octoechos-vespers";
    } else {
      table = "triodion-vespers";
    }
    console.log(table);
    let sticheraArray = [];
    let { data: octoechos, error } = await supabase
      .from(table)
      .select("text")
      .eq("tone", tone)
      .eq("aposticha", isAposticha)
      .eq("weekday", day)
      .order("stichos", { ascending: false });

    let data = octoechos;
    data.forEach((el) => (sticheraArray = [...sticheraArray, el.text]));
    if (!isAposticha) {
      setStichera(sticheraArray);
    } else {
      setAposticha(sticheraArray);
    }
  };

  const getProkeimenon = async (day) => {
    let prokeimenonArray = [];
    let { data: octoechos, error } = await supabase
      .from("octoechos-vespers-prokeimena")
      .select("prokeimenon-1,prokeimenon-2,prokeimenon-3, prokeimenon-4")
      .eq("weekday", day);
    let data = octoechos[0];
    console.log("prokeimena", data);

    for (const [key, value] of Object.entries(data)) {
      prokeimenonArray = [...prokeimenonArray, value];
    }
    console.log(prokeimenonArray);
    let arr = [];
    for (let i = 0; i < prokeimenonArray.length; i++) {
      if (prokeimenonArray[i]) {
        arr.push(prokeimenonArray[i]);
      }
    }

    setProkeimenon(arr);
  };

  const getTroparia = async (day) => {
    let tropariaArray = [];
    let { data: troparia, error } = await supabase
      .from("troparia-weekdays")
      .select("text-1,text-2,text-3, text-4")
      .eq("weekday", day + 1);
    let data = troparia[0];
    console.log("troparia", data);

    for (const [key, value] of Object.entries(data)) {
      tropariaArray = [...tropariaArray, value];
    }
    console.log(tropariaArray);
    let arr = [];
    for (let i = 0; i < tropariaArray.length; i++) {
      if (tropariaArray[i]) {
        arr.push(tropariaArray[i]);
      }
    }
    arr.reverse();
    console.log("tropariaArr", arr);
    setTroparia(arr);
  };

  let day = date.getDay();

  const onDateChange = (dateRaw, dateString) => {
    console.log(dateRaw.$d);
    let dateFormatted = dateRaw.$d;
    setDate(dateFormatted);
    weeksDiff = getWeeksDiff(new Date("2022-06-25"), dateFormatted);
    tone = getOctoechosTone(weeksDiff);
    console.log("new tone", tone);
    day = dateFormatted.getDay();
    console.log("new day", day);
    getStichos(tone, day, false);
    getStichos(tone, day, true);
    getProkeimenon(day);
  };

  let tone = getOctoechosTone(weeksDiff);
  console.log("tone", tone);

  // const extraTroparia = () => {
  //   // let extraTroparia = troparia.slice(2);

  //   extraTroparia.map((el, index) => {
  //     return (
  //       <p key={index} className="first-letter propers">
  //         {el}
  //       </p>
  //     );
  //   });
  // };

  const weekdays = [
    "niedziela",
    "poniedzia??ek",
    "wtorek",
    "??roda",
    "czwartek",
    "pi??tek",
    "sobota",
  ];

  useEffect(() => {
    getStichos(tone, day, false);
    getStichos(tone, day, true);
    getProkeimenon(day);
    getTroparia(day);

    console.log(day);
  }, [tone, day]);
  let extraTroparia = troparia.slice(2);
  const items = [
    {
      label: (
        <Switch
          style={{ backgroundColor: "#8f2121" }}
          checkedChildren="Z kap??anem"
          unCheckedChildren="Bez kap??ana"
          onChange={(checked, e) => {
            setReaderView(checked, e);
          }}
        />
      ),
      key: "0",
    },
    {
      label: (
        <ConfigProvider locale={locale}>
          <DatePicker
            // placeholder="Wybierz dat??"
            // defaultValue={dayjs("YYYY-MM-DD")}
            // format={dayjs}
            onChange={(dateRaw, dateString) =>
              onDateChange(dateRaw, dateString)
            }
          />
        </ConfigProvider>
      ),
      key: "1",
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key === "3") {
      setOpenDropdown(false);
    }
  };

  const handleOpenChange = (flag) => {
    setOpenDropdown(flag);
  };
console.log("day",day)
  return (
    <div className="service">
      <div className="service__header">
        <Space direction="horizontal" className="settings-space">
          <Dropdown
            menu={{ items, onClick: handleMenuClick }}
            trigger={["click"]}
            onOpenChange={handleOpenChange}
            open={openDropdown}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <RiSettings4Fill className="settings-icon" />
              </Space>
            </a>
          </Dropdown>
        </Space>
      </div>
      <h2 className="service-name">Nieszpory</h2>
      <p className="rubric">
        Ton {tone}, {weekdays[day]}
      </p>
      {!readerView ? (
        <RegularInitialPrayers />
      ) : (
        <>
          <p className="rubric">Kap??an:</p>
          <p className="first-letter">
            B??ogos??awiony B??g nasz, w ka??dym czasie, teraz i zawsze, i na wieki
            wiek??w.
          </p>
        </>
      )}
      <p className="rubric">
        Po <span className="rubric--quote">Amen</span> prze??o??ony lub wyznaczony
        lektor zaczyna psalm wst??pny, m??wi??c tak:
      </p>
      <p className="first-letter indent">
        Przyjd??cie, pok??o??my si?? Kr??lowi naszemu Bogu.
      </p>
      <p className="first-letter indent">
        Przyjd??cie, pok??o??my si?? i przypadnijmy do Chrystusa, Kr??la naszego i
        Boga.
      </p>
      <p className="first-letter indent">
        Przyjd??cie, pok??o??my si?? i przypadnijmy do samego Chrystusa, Kr??la i
        Boga naszego.
      </p>
      <Psalm103 />
      {!readerView ? (
        <>
          <p className="rubric">
            Nast??pnie: <span className="rubric--quote">Panie, zmi??uj si??</span>{" "}
            12 razy.
          </p>
          <p className="first-letter indent">
            Chwa??a Ojcu i Synowi, i ??wi??temu Duchowi, i teraz, i zawsze, i na
            wieki wiek??w.
          </p>
          <div className="ektenia__choir">
            <p className="rubric">Ch??r:</p> Amen.
          </div>
        </>
      ) : (
        <>
          <p className="rubric">Tak??e wielka ektenia.</p>
          <GreatEktenia />
        </>
      )}
      <p className="rubric">Recytacja Psa??terza.</p>
      {!readerView ? (
        <>
          <p className="rubric">
            Nast??pnie: <span className="rubric--quote">Panie, zmi??uj si??</span>{" "}
            3 razy.
          </p>
          <p className="first-letter indent">
            Chwa??a Ojcu i Synowi, i ??wi??temu Duchowi, i teraz, i zawsze, i na
            wieki wiek??w.{" "}
          </p>
          <div className="ektenia__choir">
            <p className="rubric">Ch??r:</p> Amen.
          </div>
        </>
      ) : (
        <>
          <p className="rubric">Po recytacji ma??a ektenia:</p>
          <LittleEktenia />
        </>
      )}
      <LordICried stichera={stichera} />
      <p className="rubric">Hymn Sofroniusza, patriarchy jerozolimskiego:</p>
      <p className="first-letter indent">
        P<span className="prayer-incipit">ogodna ??wiat??o??ci</span> ??wi??tej
        chwa??y, nie??miertelnego Ojca niebios, ??wi??tego, B??ogos??awionego, Jezu
        Chryste. Przyszli??my na zach??d s??o??ca, widz??c ??wiat??o???? wieczorn??
        ??piewamy Ojcu, Synowi, i ??wi??temu Duchowi, Bogu, bo?? godzien jest, by w
        ka??dym czasie, ??piewano Tobie zbo??nymi pie??niami, Synu Bo??y, co ??ycie
        dajesz, przeto ??wiat Ci?? s??awi.
      </p>

      <p className="rubric">Prokimenon:</p>

      <div className="propers">
        {prokeimenon.length <= 2 ? (
          <>
            <p className="first-letter indent">{prokeimenon[0]}</p>
            <div className="prokeimenon">
              <p className="rubric">Stichos:</p>
              <p className="first-letter indent">{prokeimenon[1]}</p>
            </div>
          </>
        ) : (
          <>
            <p className="first-letter indent">{prokeimenon[0]}</p>
            <div className="prokeimenon">
              <p className="rubric">Stichos 1:</p>
              <p className="first-letter indent">{prokeimenon[1]}</p>
            </div>
            <div className="prokeimenon">
              <p className="rubric">Stichos 2:</p>
              <p className="first-letter indent">{prokeimenon[2]}</p>
            </div>
            <div className="prokeimenon">
              <p className="rubric">Stichos 3:</p>
              <p className="first-letter indent">{prokeimenon[3]}</p>
            </div>
          </>
        )}
      </div>
      <p className="rubric">I po prokimenonie m??wi:</p>
      <p className="first-letter verse">
        P<span className="prayer-incipit">ozw??l, Panie</span>, w wiecz??r ten
        <span>ustrzec si?? nam od grzechu. </span>
        B??ogos??awiony jeste??, Panie, Bo??e ojc??w naszych,
        <span>i chwalebne i przes??awne jest imi?? Twoje na wieki. Amen.</span>
      </p>
      <p className="first-letter verse">
        Niech mi??osierdzie Twoje, Panie, b??dzie nad nami,
        <span>jak mieli??my nadziej?? w Tobie. </span>
        B??ogos??awiony jeste??, Panie,
        <span>naucz mnie przykaza?? Twoich.</span>
        B??ogos??awiony jeste??, W??adco,
        <span>daj mi zrozumie?? przykazania Twoje.</span>
        B??ogos??awiony jeste??, ??wi??ty,
        <span>o??wie?? mnie przykazaniami Twoimi. </span>
        Panie, mi??osierdzie Twoje na wieki,
        <span>nie gard?? dzie??em r??k Twoich. </span>
      </p>
      <p className="first-letter verse">
        Tobie przynale??y s??awa,
        <span>Tobie przynale??y pie????, </span>
        <span>Tobie chwa??a przynale??y, </span>
        Ojcu i Synowi, i ??wi??temu Duchowi,
        <span>teraz i zawsze, i na wieki wiek??w. Amen. </span>
      </p>
      {!readerView ? (
        <>
          <p className="rubric">
            Nast??pnie: <span className="rubric--quote">Panie, zmi??uj si??</span>{" "}
            12 razy.
          </p>
          <p className="first-letter indent">
            Chwa??a Ojcu i Synowi, i ??wi??temu Duchowi, i teraz, i zawsze, i na
            wieki wiek??w.
          </p>
          <div className="ektenia__choir">
            <p className="rubric">Ch??r:</p> Amen.
          </div>
        </>
      ) : (
        <>
          <p className="rubric">Kap??an:</p>
          Dope??nijmy wieczorn?? modlitw?? nasz?? do Pana.
        </>
      )}
      <p className="rubric">Stichery:</p>
      {day === 6 ? (
        <>
          <p className="first-letter propers stichera">{aposticha[4]}</p>
          <p className="rubric">Stichos 1: </p>
          <p className="first-letter verse">
            Pan zakr??lowa??, w majestat jest obleczony.
            <span>Obleczony jest Pan, przepasany pot??g??.</span>
          </p>
          <p className="first-letter propers stichera">{aposticha[3]}</p>
          <p className="rubric">Stichos 2: </p>
          <p className="first-letter verse">
            A ??wiat, kt??ry umocni??,
            <span>nie zachwieje si??.</span>
          </p>
          <p className="first-letter propers stichera">{aposticha[2]}</p>
          <p className="rubric">Stichos 2: </p>
          <p className="first-letter verse">
            Domowi Twemu, Panie,
            <span>przystoi ??wi??to???? po wszystkie dni.</span>
          </p>
          <p className="first-letter propers stichera">{aposticha[1]}</p>
          {/* <p className="rubric">
            Je??li jest sobota, m??wimy Pan zakr??lowa??, jak to wskazano (s. ).
            Je??li wypadanie ??wi??to Pa??skie, to jego stichosy. Tak samo, je??li
            wypadnie wspomnienie ??wi??tego.
          </p> */}
          <p className="rubric">
            <span className="rubric--glory">Chwa??a, i teraz.</span>
          </p>{" "}
          <p className="rubric">Teotokion:</p>
          <p className="first-letter propers stichera">{aposticha[0]}</p>
        </>
      ) : (
        <>
          <p className="first-letter propers stichera">{aposticha[3]}</p>
          <p className="rubric">Stichos 1: </p>
          <p className="first-letter verse">
            Do Ciebie wznosz?? oczy moje,
            <span>kt??ry mieszkasz w niebie. </span>
            Oto jak oczy s??ug zwr??cone s?? na r??ce ich pan??w
            <span>i jak oczy s??u????cej na r??ce jej pani, </span>
            tak oczy nasze ku Bogu, Bogu naszemu,
            <span>dop??ki nie ulituje si?? nad nami.</span>
          </p>
          <p className="first-letter propers stichera">{aposticha[2]}</p>
          <p className="rubric">Stichos 2: </p>
          <p className="first-letter verse">
            Zmi??uj si?? nad nami, Panie, zmi??uj si?? nad nami,
            <span>albowiem wzgard?? jeste??my nasyceni. </span>
            Dusza nasza nasycona jest szyderstwem zarozumialc??w
            <span>i wzgard?? pysza??k??w.</span>
          </p>
          <p className="first-letter propers stichera">{aposticha[1]}</p>
          {/* <p className="rubric">
            Je??li jest sobota, m??wimy Pan zakr??lowa??, jak to wskazano (s. ).
            Je??li wypadanie ??wi??to Pa??skie, to jego stichosy. Tak samo, je??li
            wypadnie wspomnienie ??wi??tego.
          </p> */}
          <p className="rubric">
            <span className="rubric--glory">Chwa??a, i teraz.</span>
          </p>{" "}
          <p className="rubric">Teotokion:</p>
          <p className="first-letter propers stichera">{aposticha[0]}</p>
        </>
      )}

      <p className="rubric">Tak??e modlitwa ??wi??tego Symeona Starca:</p>
      <p className="first-letter indent">
        T<span className="prayer-incipit">eraz pozwalasz odej????</span> s??udze
        Twemu, W??adco, wed??ug s??owa Twego, w pokoju, Bowiem oczy moje widzia??y
        zbawienie Twoje, kt??re?? przygotowa?? wobec wszystkich ludzi, ??wiat??o???? na
        o??wiecenie narod??w i chwa???? ludu Twego, Izraela.
      </p>
      <p className="first-letter indent" style={{ marginTop: "10px" }}>
        ??wi??ty Bo??e, ??wi??ty Mocny, ??wi??ty Nie??miertelny, zmi??uj si?? nad nami
        (trzy razy).
      </p>
      <p className="first-letter indent">
        Chwa??a Ojcu i Synowi, i ??wi??temu Duchowi, i teraz, i zawsze, i na wieki
        wiek??w. Amen.
      </p>
      <p className="first-letter indent">
        Naj??wi??tsza Tr??jco, zmi??uj si?? nad nami, Panie, oczy???? grzechy nasze,
        W??adco, przebacz nieprawo??ci nasze, ??wi??ty, nawied?? nas, i ulecz niemoce
        nasze, dla imienia Twego.
      </p>
      <p className="first-letter indent">Panie, zmi??uj si?? (trzy razy).</p>
      <p className="first-letter indent">
        Chwa??a Ojcu i Synowi, i ??wi??temu Duchowi, i teraz, i zawsze, i na wieki
        wiek??w. Amen.
      </p>
      <p className="first-letter indent">
        Ojcze nasz, kt??ry?? jest w niebiesiech, ??wi???? si?? imi?? Twoje, przyjd??
        kr??lestwo Twoje, b??d?? wola Twoja, jako w niebie tak i na ziemi, chleba
        naszego powszedniego daj nam dzisiaj, i odpu???? nam nasze winy, jako i my
        odpuszczamy naszym winowajcom, i nie ww??d?? nas w pokuszenie, ale nas
        zbaw ode z??ego.
      </p>
      <p className="first-letter indent">
        Panie Jezu Chryste, Synu Bo??y, zmi??uj si?? nad nami.{" "}
      </p>
      <div className="ektenia__choir">
        <p className="rubric">Ch??r:</p> Amen.
      </div>
      <p className="rubric">Troparion i kontakiony:</p>
      {troparia.length <= 2 ? (
        <>
          <p className="first-letter propers">{troparia[1]}</p>
          <p className="rubric">
            <span className="rubric--glory"> Chwa??a, i teraz. </span>
          </p>
          <p className="first-letter propers">{troparia[0]}</p>
        </>
      ) : (
        <>
          <p className="propers">
            {extraTroparia.map((el, index) => {
              return (
                <p key={index} className="first-letter">
                  {el}
                </p>
              );
            })}
          </p>
          {/* <p className="first-letter propers">{troparia[2]}</p> */}
          <p className="rubric">
            <span className="rubric--glory"> Chwa??a. </span>
          </p>
          <p className="first-letter propers">{troparia[1]}</p>
          <p className="rubric">
            <span className="rubric--glory"> I teraz. </span>
          </p>
          <p className="first-letter propers">{troparia[0]}</p>
        </>
      )}
      <p className="rubric">Rozes??anie:</p>
      <p className="rubric">Lektor:</p> 
      <p className="first-letter indent">
        Umocnij, Bo??e, ??wi??t?? prawos??awn?? wiar?? i prawos??awnych chrze??cijan na
        wieki wiek??w.
      </p>
      <p className="rubric">Ch??r:</p><p className="first-letter indent">
        Czcigodniejsz?? od Cherubin??w i bez por??wnania chwalebniejsz?? od
        Serafin??w, kt??ra?? bez zmiany Boga S??owo zrodzi??a, Ciebie, prawdziw??
        Bogurodzic??, wys??awiamy.
      </p>
      <p className="first-letter indent">Panie, zmi??uj si?? <span className="rubric">(trzy razy)</span>.</p>
      <p className="first-letter indent">Panie, pob??ogos??aw!</p>
      <p className="rubric">Lektor:</p> 
      <p  className="first-letter indent">{day === 0 ? "Zmartychwsta??y " : null}
        Panie Jezu Chryste, Synu Bo??y, dla modlitw Przeczystej Twojej Matki,
        ??wi??tych i bogono??nych Ojc??w naszych i wszystkich ??wi??tych, zmi??uj si??
        nad nami i zbaw nas, jako dobry i przyjaciel cz??owieka.
      </p>
      <p className="ektenia__choir"><p className="rubric">Ch??r:</p>Amen.</p>
    </div>
  );
};

export default Vespers;
