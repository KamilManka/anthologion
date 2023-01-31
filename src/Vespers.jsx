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
    "poniedziałek",
    "wtorek",
    "środa",
    "czwartek",
    "piątek",
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
          checkedChildren="Z kapłanem"
          unCheckedChildren="Bez kapłana"
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
            // placeholder="Wybierz datę"
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
          <p className="rubric">Kapłan:</p>
          <p className="first-letter">
            Błogosławiony Bóg nasz, w każdym czasie, teraz i zawsze, i na wieki
            wieków.
          </p>
        </>
      )}
      <p className="rubric">
        Po <span className="rubric--quote">Amen</span> przełożony lub wyznaczony
        lektor zaczyna psalm wstępny, mówiąc tak:
      </p>
      <p className="first-letter indent">
        Przyjdźcie, pokłońmy się Królowi naszemu Bogu.
      </p>
      <p className="first-letter indent">
        Przyjdźcie, pokłońmy się i przypadnijmy do Chrystusa, Króla naszego i
        Boga.
      </p>
      <p className="first-letter indent">
        Przyjdźcie, pokłońmy się i przypadnijmy do samego Chrystusa, Króla i
        Boga naszego.
      </p>
      <Psalm103 />
      {!readerView ? (
        <>
          <p className="rubric">
            Następnie: <span className="rubric--quote">Panie, zmiłuj się</span>{" "}
            12 razy.
          </p>
          <p className="first-letter indent">
            Chwała Ojcu i Synowi, i Świętemu Duchowi, i teraz, i zawsze, i na
            wieki wieków.
          </p>
          <div className="ektenia__choir">
            <p className="rubric">Chór:</p> Amen.
          </div>
        </>
      ) : (
        <>
          <p className="rubric">Także wielka ektenia.</p>
          <GreatEktenia />
        </>
      )}
      <p className="rubric">Recytacja Psałterza.</p>
      {!readerView ? (
        <>
          <p className="rubric">
            Następnie: <span className="rubric--quote">Panie, zmiłuj się</span>{" "}
            3 razy.
          </p>
          <p className="first-letter indent">
            Chwała Ojcu i Synowi, i Świętemu Duchowi, i teraz, i zawsze, i na
            wieki wieków.{" "}
          </p>
          <div className="ektenia__choir">
            <p className="rubric">Chór:</p> Amen.
          </div>
        </>
      ) : (
        <>
          <p className="rubric">Po recytacji mała ektenia:</p>
          <LittleEktenia />
        </>
      )}
      <LordICried stichera={stichera} />
      <p className="rubric">Hymn Sofroniusza, patriarchy jerozolimskiego:</p>
      <p className="first-letter indent">
        P<span className="prayer-incipit">ogodna światłości</span> świętej
        chwały, nieśmiertelnego Ojca niebios, Świętego, Błogosławionego, Jezu
        Chryste. Przyszliśmy na zachód słońca, widząc światłość wieczorną
        śpiewamy Ojcu, Synowi, i Świętemu Duchowi, Bogu, boś godzien jest, by w
        każdym czasie, śpiewano Tobie zbożnymi pieśniami, Synu Boży, co życie
        dajesz, przeto świat Cię sławi.
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
      <p className="rubric">I po prokimenonie mówi:</p>
      <p className="first-letter verse">
        P<span className="prayer-incipit">ozwól, Panie</span>, w wieczór ten
        <span>ustrzec się nam od grzechu. </span>
        Błogosławiony jesteś, Panie, Boże ojców naszych,
        <span>i chwalebne i przesławne jest imię Twoje na wieki. Amen.</span>
      </p>
      <p className="first-letter verse">
        Niech miłosierdzie Twoje, Panie, będzie nad nami,
        <span>jak mieliśmy nadzieję w Tobie. </span>
        Błogosławiony jesteś, Panie,
        <span>naucz mnie przykazań Twoich.</span>
        Błogosławiony jesteś, Władco,
        <span>daj mi zrozumieć przykazania Twoje.</span>
        Błogosławiony jesteś, Święty,
        <span>oświeć mnie przykazaniami Twoimi. </span>
        Panie, miłosierdzie Twoje na wieki,
        <span>nie gardź dziełem rąk Twoich. </span>
      </p>
      <p className="first-letter verse">
        Tobie przynależy sława,
        <span>Tobie przynależy pieśń, </span>
        <span>Tobie chwała przynależy, </span>
        Ojcu i Synowi, i Świętemu Duchowi,
        <span>teraz i zawsze, i na wieki wieków. Amen. </span>
      </p>
      {!readerView ? (
        <>
          <p className="rubric">
            Następnie: <span className="rubric--quote">Panie, zmiłuj się</span>{" "}
            12 razy.
          </p>
          <p className="first-letter indent">
            Chwała Ojcu i Synowi, i Świętemu Duchowi, i teraz, i zawsze, i na
            wieki wieków.
          </p>
          <div className="ektenia__choir">
            <p className="rubric">Chór:</p> Amen.
          </div>
        </>
      ) : (
        <>
          <p className="rubric">Kapłan:</p>
          Dopełnijmy wieczorną modlitwę naszą do Pana.
        </>
      )}
      <p className="rubric">Stichery:</p>
      {day === 6 ? (
        <>
          <p className="first-letter propers stichera">{aposticha[4]}</p>
          <p className="rubric">Stichos 1: </p>
          <p className="first-letter verse">
            Pan zakrólował, w majestat jest obleczony.
            <span>Obleczony jest Pan, przepasany potęgą.</span>
          </p>
          <p className="first-letter propers stichera">{aposticha[3]}</p>
          <p className="rubric">Stichos 2: </p>
          <p className="first-letter verse">
            A świat, który umocnił,
            <span>nie zachwieje się.</span>
          </p>
          <p className="first-letter propers stichera">{aposticha[2]}</p>
          <p className="rubric">Stichos 2: </p>
          <p className="first-letter verse">
            Domowi Twemu, Panie,
            <span>przystoi świętość po wszystkie dni.</span>
          </p>
          <p className="first-letter propers stichera">{aposticha[1]}</p>
          {/* <p className="rubric">
            Jeśli jest sobota, mówimy Pan zakrólował, jak to wskazano (s. ).
            Jeśli wypadanie święto Pańskie, to jego stichosy. Tak samo, jeśli
            wypadnie wspomnienie świętego.
          </p> */}
          <p className="rubric">
            <span className="rubric--glory">Chwała, i teraz.</span>
          </p>{" "}
          <p className="rubric">Teotokion:</p>
          <p className="first-letter propers stichera">{aposticha[0]}</p>
        </>
      ) : (
        <>
          <p className="first-letter propers stichera">{aposticha[3]}</p>
          <p className="rubric">Stichos 1: </p>
          <p className="first-letter verse">
            Do Ciebie wznoszę oczy moje,
            <span>który mieszkasz w niebie. </span>
            Oto jak oczy sług zwrócone są na ręce ich panów
            <span>i jak oczy służącej na ręce jej pani, </span>
            tak oczy nasze ku Bogu, Bogu naszemu,
            <span>dopóki nie ulituje się nad nami.</span>
          </p>
          <p className="first-letter propers stichera">{aposticha[2]}</p>
          <p className="rubric">Stichos 2: </p>
          <p className="first-letter verse">
            Zmiłuj się nad nami, Panie, zmiłuj się nad nami,
            <span>albowiem wzgardą jesteśmy nasyceni. </span>
            Dusza nasza nasycona jest szyderstwem zarozumialców
            <span>i wzgardą pyszałków.</span>
          </p>
          <p className="first-letter propers stichera">{aposticha[1]}</p>
          {/* <p className="rubric">
            Jeśli jest sobota, mówimy Pan zakrólował, jak to wskazano (s. ).
            Jeśli wypadanie święto Pańskie, to jego stichosy. Tak samo, jeśli
            wypadnie wspomnienie świętego.
          </p> */}
          <p className="rubric">
            <span className="rubric--glory">Chwała, i teraz.</span>
          </p>{" "}
          <p className="rubric">Teotokion:</p>
          <p className="first-letter propers stichera">{aposticha[0]}</p>
        </>
      )}

      <p className="rubric">Także modlitwa świętego Symeona Starca:</p>
      <p className="first-letter indent">
        T<span className="prayer-incipit">eraz pozwalasz odejść</span> słudze
        Twemu, Władco, według słowa Twego, w pokoju, Bowiem oczy moje widziały
        zbawienie Twoje, któreś przygotował wobec wszystkich ludzi, Światłość na
        oświecenie narodów i chwałę ludu Twego, Izraela.
      </p>
      <p className="first-letter indent" style={{ marginTop: "10px" }}>
        Święty Boże, Święty Mocny, Święty Nieśmiertelny, zmiłuj się nad nami
        (trzy razy).
      </p>
      <p className="first-letter indent">
        Chwała Ojcu i Synowi, i Świętemu Duchowi, i teraz, i zawsze, i na wieki
        wieków. Amen.
      </p>
      <p className="first-letter indent">
        Najświętsza Trójco, zmiłuj się nad nami, Panie, oczyść grzechy nasze,
        Władco, przebacz nieprawości nasze, Święty, nawiedź nas, i ulecz niemoce
        nasze, dla imienia Twego.
      </p>
      <p className="first-letter indent">Panie, zmiłuj się (trzy razy).</p>
      <p className="first-letter indent">
        Chwała Ojcu i Synowi, i Świętemu Duchowi, i teraz, i zawsze, i na wieki
        wieków. Amen.
      </p>
      <p className="first-letter indent">
        Ojcze nasz, któryś jest w niebiesiech, święć się imię Twoje, przyjdź
        królestwo Twoje, bądź wola Twoja, jako w niebie tak i na ziemi, chleba
        naszego powszedniego daj nam dzisiaj, i odpuść nam nasze winy, jako i my
        odpuszczamy naszym winowajcom, i nie wwódź nas w pokuszenie, ale nas
        zbaw ode złego.
      </p>
      <p className="first-letter indent">
        Panie Jezu Chryste, Synu Boży, zmiłuj się nad nami.{" "}
      </p>
      <div className="ektenia__choir">
        <p className="rubric">Chór:</p> Amen.
      </div>
      <p className="rubric">Troparion i kontakiony:</p>
      {troparia.length <= 2 ? (
        <>
          <p className="first-letter propers">{troparia[1]}</p>
          <p className="rubric">
            <span className="rubric--glory"> Chwała, i teraz. </span>
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
            <span className="rubric--glory"> Chwała. </span>
          </p>
          <p className="first-letter propers">{troparia[1]}</p>
          <p className="rubric">
            <span className="rubric--glory"> I teraz. </span>
          </p>
          <p className="first-letter propers">{troparia[0]}</p>
        </>
      )}
      <p className="rubric">Rozesłanie:</p>
      <p className="rubric">Lektor:</p> 
      <p className="first-letter indent">
        Umocnij, Boże, świętą prawosławną wiarę i prawosławnych chrześcijan na
        wieki wieków.
      </p>
      <p className="rubric">Chór:</p><p className="first-letter indent">
        Czcigodniejszą od Cherubinów i bez porównania chwalebniejszą od
        Serafinów, któraś bez zmiany Boga Słowo zrodziła, Ciebie, prawdziwą
        Bogurodzicę, wysławiamy.
      </p>
      <p className="first-letter indent">Panie, zmiłuj się <span className="rubric">(trzy razy)</span>.</p>
      <p className="first-letter indent">Panie, pobłogosław!</p>
      <p className="rubric">Lektor:</p> 
      <p  className="first-letter indent">{day === 0 ? "Zmartychwstały " : null}
        Panie Jezu Chryste, Synu Boży, dla modlitw Przeczystej Twojej Matki,
        świętych i bogonośnych Ojców naszych i wszystkich świętych, zmiłuj się
        nad nami i zbaw nas, jako dobry i przyjaciel człowieka.
      </p>
      <p className="ektenia__choir"><p className="rubric">Chór:</p>Amen.</p>
    </div>
  );
};

export default Vespers;
