import React, { useEffect, useState, useRef } from "react";
import DataTable from "datatables.net-react";
import DataTableLib from "datatables.net-dt";
import ResponsiveLib from "datatables.net-responsive-dt";

import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";

import axios from "axios";
import Headers from "../Main/Headers";
import './Leaderboard.css';

DataTable.use(DataTableLib);
DataTable.use(ResponsiveLib);

const Leaderboard = () => {
    const [data, setData] = useState([]);
    const dataTableInstance = useRef(null);

    useEffect(() => {
        axios.get("https://api-pacman.vzbb.site/leaderboard")
            .then((res) => {
                const players = res.data.players;

                const tableData = players.map((player, index) => {
                    const rank = index + 1;
                    const medal = rank === 1 ? "1 🥇" : rank === 2 ? "2 🥈" : rank === 3 ? "3 🥉" : rank;
                    return [
                        medal,
                        player.username || player.displayName || "unknown",
                        player.maxScore || 0,
                        player.totalScore || 0,
                    ];
                });

                setData(tableData);
            })
            .catch((err) => {
                console.error("Leaderboard fetch error:", err);
            });
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (dataTableInstance.current) {
                dataTableInstance.current.responsive.recalc();
            }
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const columns = [
        { title: "Rank" },
        { title: "Name" },
        { title: "Score" },
        { title: "Level" },
    ];

    return (
        <>
            <Headers />
            <div className="leaderboard-wrapper">
                <DataTable
                    data={data}
                    columns={columns}
                    options={{
                        paging: true,
                        searching: true,
                        order: [[2, 'desc']],
                        lengthChange: false,
                        info: false,
                        responsive: true,
                        initComplete: function () {
                            dataTableInstance.current = this.api();
                        },
                    }}
                />
            </div>
        </>
    );
};

export default Leaderboard;
