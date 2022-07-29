export default summationItem => {
    const lang = 'Unlabelled'
    const labelRole = 'Default'
    const grid = []
    const summationItemName = summationItem.Label.Default.Unlabelled
    const maxRow =
        summationItem.ContributingConcepts.length +
        summationItem.ContextualMemberGrid.length +
        1
    const maxCol = summationItem.PeriodHeaders.length + 2
    for (let i = 0; i < maxRow; i++) {
        const row = []
        if (i < summationItem.ContextualMemberGrid.length + 1) {
            for (let j = 0; j < maxCol; j++) {
                if (j === 0) {
                    row.push('')
                } else if (j === 1) {
                    if (i === 0) {
                        row.push('')
                    } else {
                        const voidCell = summationItem.VoidQuadrant[i - 1]
                        if (voidCell.TypedDomain) {
                            if (voidCell.TypedDomain.Label[labelRole]) {
                                const langVal =
                                    voidCell.TypedDomain.Label[labelRole][lang]
                                const unlabelledVal =
                                    voidCell.TypedDomain.Label.Default
                                        .Unlabelled
                                row.push(langVal || unlabelledVal)
                            } else {
                                row.push(
                                    voidCell.TypedDomain.Label.Default
                                        .Unlabelled
                                )
                            }
                        } else {
                            if (voidCell.Dimension.Label[labelRole]) {
                                const langVal =
                                    voidCell.Dimension.Label[labelRole][lang]
                                const unlabelledVal =
                                    voidCell.Dimension.Label.Default.Unlabelled
                                row.push(langVal || unlabelledVal)
                            } else {
                                row.push(
                                    voidCell.Dimension.Label.Default.Unlabelled
                                )
                            }
                        }
                    }
                } else {
                    if (i === 0) {
                        const ph = summationItem.PeriodHeaders[j - 2]
                        row.push(ph[lang] || ph.Unlabelled)
                    } else {
                        const memberCell =
                            summationItem.ContextualMemberGrid[i - 1][j - 2]
                        if (memberCell.TypedMember) {
                            row.push(memberCell.TypedMember)
                        } else if (memberCell.ExplicitMember) {
                            if (memberCell.ExplicitMember.Label[labelRole]) {
                                const explicitMember = memberCell.ExplicitMember
                                const langVal =
                                    explicitMember.Label[labelRole][lang]
                                const unlabelledVal =
                                    explicitMember.Label.Default.Unlabelled
                                row.push(langVal || unlabelledVal)
                            } else {
                                row.push(
                                    memberCell.ExplicitMember.Label.Default
                                        .Unlabelled
                                )
                            }
                        } else {
                            row.push('')
                        }
                    }
                }
            }
        } else {
            const index = i - summationItem.ContextualMemberGrid.length - 1
            for (let j = 0; j < maxCol; j++) {
                if (j === 0) {
                    let fillText =
                        summationItem.ContributingConcepts[index].Sign +
                        summationItem.ContributingConcepts[index].Scale
                    row.push(fillText)
                } else if (j === 1) {
                    const il = summationItem.ContributingConcepts[index]
                    if (il.Label[labelRole]) {
                        row.push(
                            il.Label[labelRole][lang] ||
                                il.Label.Default.Unlabelled
                        )
                    } else {
                        row.push(il.Label.Default.Unlabelled)
                    }
                } else {
                    const fact = summationItem.FactualQuadrant[index][j - 2]
                    if (fact.Unlabelled.Core) {
                        if (fact[lang]) {
                            row.push(
                                fact[lang].Head +
                                    fact[lang].Core +
                                    fact[lang].Tail
                            )
                        } else {
                            row.push(
                                fact.Unlabelled.Head +
                                    fact.Unlabelled.Core +
                                    fact.Unlabelled.Tail
                            )
                        }
                    } else if (fact.Unlabelled.InnerHtml) {
                        row.push('...')
                    } else {
                        row.push('')
                    }
                }
            }
        }
        row.push('')
        grid.push(row)
    }
    let row = []
    const factualQuadrantLastIndex = summationItem.FactualQuadrant.length - 1
    for (let k = 0; k < grid[0].length - 1; k++) {
        if (k === 0) {
            row.push('=')
        } else if (k === 1) {
            row.push(summationItemName)
        } else {
            let indexWithinFQLI = k - 2
            const fact = summationItem.FactualQuadrant[factualQuadrantLastIndex][indexWithinFQLI]
            if (fact.Unlabelled.Core) {
                if (fact[lang]) {
                    row.push(
                        fact[lang].Head +
                            fact[lang].Core +
                            fact[lang].Tail
                    )
                } else {
                    row.push(
                        fact.Unlabelled.Head +
                            fact.Unlabelled.Core +
                            fact.Unlabelled.Tail
                    )
                }
            } else {
                row.push('')
            }
        }
    }

    row.push('')
    grid.push(row)
    let last = []
    for (let k = 0; k < grid[0].length; k++) {
        last.push('')
    }
    grid.push(last)
    return {
        grid,
        numFrozenRows: summationItem.VoidQuadrant.length + 1
    }
}
